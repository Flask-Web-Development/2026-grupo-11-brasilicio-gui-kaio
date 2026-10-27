import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth/session";

import { API_URL } from "@/lib/api/config";

type BackendUser = { username?: unknown; email?: unknown; role?: unknown };

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
    accessToken?: unknown;
  } | null;
  const accessToken =
    typeof body?.accessToken === "string" ? body.accessToken : null;

  const subject = accessToken ? tokenSubject(accessToken) : null;
  if (!accessToken || !subject || !API_URL) {
    return NextResponse.json(
      { error: "Invalid authentication" },
      { status: 400 },
    );
  }

  const response = await fetch(
    `${API_URL}/users/${encodeURIComponent(subject)}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    },
  );
  if (!response.ok) {
    return NextResponse.json(
      { error: "Invalid authentication" },
      { status: 401 },
    );
  }

  const user = (await response.json()) as BackendUser;
  const username = typeof user.username === "string" ? user.username : null;
  if (!username) {
    return NextResponse.json(
      { error: "Invalid user identity" },
      { status: 502 },
    );
  }

  await createSession({
    subject,
    username,
    email: typeof user.email === "string" ? user.email : undefined,
    isAdmin: user.role === "Admin",
  });
  return NextResponse.json({ ok: true });
}
