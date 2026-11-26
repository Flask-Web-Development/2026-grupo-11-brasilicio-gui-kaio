import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth/session";

export async function logout() {
  await clearSession();
  return NextResponse.json({ ok: true });
}
