import { NextResponse } from "next/server";
import { createSession, getSession } from "@/lib/auth/session";

import { API_URL } from "@/lib/api/config";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.needsPasswordSetup) {
    return NextResponse.json(
      { error: "Password setup is not required" },
      { status: 400 },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    password?: unknown;
  } | null;
  const password = typeof body?.password === "string" ? body.password : "";
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must contain at least 8 characters" },
      { status: 400 },
    );
  }

  const syncSecret = process.env.SUAP_SYNC_SECRET;
  if (!API_URL || !syncSecret) {
    return NextResponse.json(
      { error: "Password setup is not configured" },
      { status: 500 },
    );
  }

  const response = await fetch(`${API_URL}/users/suap/password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-SUAP-Sync-Secret": syncSecret,
    },
    body: JSON.stringify({ user_id: Number(session.subject), password }),
    cache: "no-store",
  });
  if (!response.ok) {
    return NextResponse.json(
      { error: "Unable to set password" },
      { status: 502 },
    );
  }

  const { expiresAt, needsPasswordSetup, ...sessionData } = session;
  void expiresAt;
  void needsPasswordSetup;
  await createSession({ ...sessionData, needsPasswordSetup: false });
  return NextResponse.json({ ok: true });
}
