import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth/session";

import { fetchBackend } from "@/lib/server/backend";

type BackendUser = {
  username?: unknown;
  user_id?: unknown;
  email?: unknown;
  role?: unknown;
};

function tokenSubject(token: string) {
  const [, payload] = token.split(".");
  if (!payload) return null;
  try {
    const parsed = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as { sub?: unknown };
    return typeof parsed.sub === "number" || typeof parsed.sub === "string"
      ? String(parsed.sub)
      : null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    username?: unknown;
    password?: unknown;
  } | null;
  const loginUsername =
    typeof body?.username === "string" ? body.username.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (!loginUsername || !password) {
    return NextResponse.json(
      { error: "Matrícula e senha são obrigatórias" },
      { status: 400 },
    );
  }

  const loginResponse = await fetchBackend("login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: loginUsername, password }),
    cache: "no-store",
  });
  const loginData = (await loginResponse.json().catch(() => null)) as {
    access_token?: unknown;
  } | null;
  if (!loginResponse.ok) {
    return NextResponse.json(
      { error: "Credenciais SUAP inválidas" },
      { status: loginResponse.status },
    );
  }
  const accessToken =
    typeof loginData?.access_token === "string" ? loginData.access_token : null;
  const subject = accessToken ? tokenSubject(accessToken) : null;
  if (!accessToken || !subject) {
    return NextResponse.json(
      { error: "Invalid authentication" },
      { status: 502 },
    );
  }

  const response = await fetchBackend(`users/${encodeURIComponent(subject)}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!response.ok) {
    return NextResponse.json(
      { error: "Invalid authentication" },
      { status: 401 },
    );
  }

  const user = (await response.json()) as BackendUser;
  const persistedUsername =
    typeof user.username === "string"
      ? user.username
      : typeof user.user_id === "string"
        ? user.user_id
        : null;
  if (!persistedUsername) {
    return NextResponse.json(
      { error: "Invalid user identity" },
      { status: 502 },
    );
  }

  await createSession({
    subject,
    accessToken,
    username: persistedUsername,
    email: typeof user.email === "string" ? user.email : undefined,
    isAdmin: user.role === "Admin" || user.role === "ADMIN",
    isAdminMaster: false,
  });
  return NextResponse.json({ ok: true });
}
