import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth/session";
import { fetchBackend } from "@/lib/server/backend";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    username?: unknown;
    password?: unknown;
  } | null;
  const username =
    typeof body?.username === "string" ? body.username.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password are required" },
      { status: 400 },
    );
  }

  const response = await fetchBackend("login/master", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    cache: "no-store",
  });
  const data = (await response.json().catch(() => null)) as {
    error?: unknown;
    access_token?: unknown;
  } | null;
  if (!response.ok) {
    const message =
      typeof data?.error === "string"
        ? data.error
        : "Unable to authenticate Admin Master";
    return NextResponse.json({ error: message }, { status: response.status });
  }
  if (typeof data?.access_token !== "string") {
    return NextResponse.json(
      { error: "Backend authentication token was not returned" },
      { status: 502 },
    );
  }

  await createSession({
    subject: "admin-master",
    accessToken: data.access_token,
    username,
    isAdmin: true,
  });
  return NextResponse.json({ ok: true });
}
