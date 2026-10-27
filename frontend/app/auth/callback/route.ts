import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSession } from "@/lib/auth/session";
import { getSuapStrategy } from "@/lib/auth/passport";

import { API_URL } from "@/lib/api/config";

const STATE_COOKIE = "suap_oauth_state";

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.has("error")) {
    return errorResponse("SUAP authorization was not completed");
  }

  const code = url.searchParams.get("code");
  const returnedState = url.searchParams.get("state");
  const cookieStore = await cookies();
  const storedState = cookieStore.get(STATE_COOKIE)?.value;
  cookieStore.delete(STATE_COOKIE);

  if (!returnedState || !storedState || returnedState !== storedState) {
    return errorResponse("Invalid OAuth state");
  }
  if (!code) return errorResponse("Authorization code is missing");

  let stage = "strategy";
  try {
    const strategy = getSuapStrategy();
    stage = "token";
    const accessToken = await strategy.exchangeCode(code);
    stage = "profile";
    const identity = await strategy.loadProfile(accessToken);
    const subject =
      stringValue(identity.identificacao) ??
      stringValue(identity.username) ??
      stringValue(identity.matricula) ??
      stringValue(identity.email);
    if (!subject)
      return errorResponse("SUAP returned an invalid identity", 502);

    const syncSecret = process.env.SUAP_SYNC_SECRET;
    const username =
      stringValue(identity.username) ??
      stringValue(identity.identificacao) ??
      stringValue(identity.matricula) ??
      subject;
    const email = stringValue(identity.email);
    if (!API_URL || !syncSecret) {
      return errorResponse("User synchronization is not configured", 500);
    }

    stage = "backend-sync";
    const userResponse = await fetch(`${API_URL}/users/suap`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-SUAP-Sync-Secret": syncSecret,
      },
      body: JSON.stringify({ username, email }),
      cache: "no-store",
    });
    if (!userResponse.ok) {
      console.error("[SUAP OAuth] backend synchronization rejected request", {
        status: userResponse.status,
      });
      return errorResponse("Unable to synchronize SUAP user", 502);
    }

    const user = (await userResponse.json()) as {
      username?: unknown;
      email?: unknown;
      role?: unknown;
      id?: unknown;
    };
    const persistedUsername = stringValue(user.username) ?? username;
    const role = user.role === "Admin" ? "Admin" : "User";

    await createSession({
      subject: String(user.id ?? subject),
      username: persistedUsername,
      email: stringValue(user.email) ?? email,
      name: stringValue(identity.nome) ?? stringValue(identity.name),
      isAdmin: role === "Admin",
      needsPasswordSetup: true,
    });
    console.info("[SUAP] authenticated user", {
      id: user.id,
      username: persistedUsername,
      email: stringValue(user.email) ?? email,
      role,
    });
    return NextResponse.redirect(new URL("/auth/setup-password", request.url));
  } catch (error) {
    console.error("[SUAP OAuth] callback failed", {
      stage,
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return errorResponse("Unable to complete SUAP authentication", 502);
  }
}
