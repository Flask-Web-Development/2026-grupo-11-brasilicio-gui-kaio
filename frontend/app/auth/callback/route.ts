import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSession } from "@/lib/auth/session";
import { getSuapStrategy } from "@/lib/auth/passport";

import { fetchBackend } from "@/lib/server/backend";

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
      stringValue(identity.matricula) ??
      stringValue(identity.username) ??
      stringValue(identity.email);
    if (!subject)
      return errorResponse("SUAP returned an invalid identity", 502);

    const syncSecret = process.env.SUAP_SYNC_SECRET;
    const username =
      stringValue(identity.identificacao) ??
      stringValue(identity.matricula) ??
      stringValue(identity.username) ??
      subject;
    const email = stringValue(identity.email);
    const name = stringValue(identity.nome) ?? stringValue(identity.name);
    const photo =
      stringValue(identity.url_foto_75x100) ?? stringValue(identity.photo);
    const course = stringValue(identity.curso) ?? stringValue(identity.course);
    const campus = stringValue(identity.campus);
    if (!syncSecret) {
      return errorResponse("User synchronization is not configured", 500);
    }

    stage = "backend-sync";
    const userResponse = await fetchBackend("users/suap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-SUAP-Sync-Secret": syncSecret,
      },
      body: JSON.stringify({ username, email, name, photo, course, campus }),
      cache: "no-store",
    });
    if (!userResponse.ok) {
      console.error("[SUAP OAuth] backend synchronization rejected request", {
        status: userResponse.status,
      });
      return errorResponse("Unable to synchronize SUAP user", 502);
    }

    stage = "backend-login";
    const loginResponse = await fetchBackend("login/oauth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-SUAP-Sync-Secret": syncSecret,
      },
      body: JSON.stringify({ user_id: username }),
      cache: "no-store",
    });
    const loginData = (await loginResponse.json().catch(() => null)) as {
      access_token?: unknown;
    } | null;
    if (!loginResponse.ok || typeof loginData?.access_token !== "string") {
      console.error("[SUAP OAuth] backend token exchange failed", {
        status: loginResponse.status,
      });
      return errorResponse("Unable to authenticate SUAP user", 502);
    }

    const user = (await userResponse.json()) as {
      username?: unknown;
      user_id?: unknown;
      email?: unknown;
      role?: unknown;
      id?: unknown;
    };
    const persistedUsername =
      stringValue(user.username) ?? stringValue(user.user_id) ?? username;
    const role =
      user.role === "Admin" || user.role === "ADMIN" ? "Admin" : "User";

    await createSession({
      subject: String(user.id ?? user.user_id ?? subject),
      accessToken: loginData.access_token,
      username: persistedUsername,
      email: stringValue(user.email) ?? email,
      name,
      isAdmin: role === "Admin",
      isAdminMaster: false,
    });
    console.info("[SUAP] authenticated user", {
      id: user.id,
      username: persistedUsername,
      email: stringValue(user.email) ?? email,
      role,
    });
    return NextResponse.redirect(new URL("/", request.url));
  } catch (error) {
    console.error("[SUAP OAuth] callback failed", {
      stage,
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return errorResponse("Unable to complete SUAP authentication", 502);
  }
}
