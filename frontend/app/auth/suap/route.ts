import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSuapStrategy } from "@/lib/auth/passport";

const STATE_COOKIE = "suap_oauth_state";

export async function GET(request: Request) {
  try {
    const state = randomBytes(32).toString("base64url");
    const authorizationUrl = getSuapStrategy().buildAuthorizationUrl(state);

    (await cookies()).set(STATE_COOKIE, state, {
      httpOnly: true,
      sameSite: "lax",
      secure:
        process.env.NODE_ENV === "production" ||
        new URL(request.url).protocol === "https:",
      path: "/",
      maxAge: 600,
    });

    return NextResponse.redirect(authorizationUrl);
  } catch {
    return NextResponse.json(
      { error: "OAuth is not configured" },
      { status: 500 },
    );
  }
}
