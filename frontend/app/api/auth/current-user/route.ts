import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";

// Devolve só o que a interface precisa saber (nunca o accessToken).
export async function GETCurretUser() {
  const session = await getSession();

  if (!session)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  return NextResponse.json({
    username: session.username ?? null,
    name: session.name ?? null,
    isAdmin: session.isAdmin,
    isAdminMaster: session.isAdminMaster === true,
  });
}
