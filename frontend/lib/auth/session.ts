import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "ifpar_session";
const SESSION_MAX_AGE = 60 * 60 * 8;

export type AuthSession = {
  subject: string;
  username?: string;
  email?: string;
  name?: string;
  isAdmin: boolean;
  needsPasswordSetup?: boolean;
  expiresAt: number;
};

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must contain at least 32 characters");
  }
  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret())
    .update(value)
    .digest("base64url");
}

function encode(session: AuthSession) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function decode(value: string): AuthSession | null {
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (
    actualBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(actualBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as AuthSession;
    if (
      typeof session.subject !== "string" ||
      typeof session.expiresAt !== "number" ||
      typeof session.isAdmin !== "boolean" ||
      session.expiresAt <= Date.now()
    ) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export async function createSession(session: Omit<AuthSession, "expiresAt">) {
  const cookieStore = await cookies();
  cookieStore.set(
    SESSION_COOKIE,
    encode({
      ...session,
      expiresAt: Date.now() + SESSION_MAX_AGE * 1000,
    }),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    },
  );
}

export async function getSession() {
  const value = (await cookies()).get(SESSION_COOKIE)?.value;
  return value ? decode(value) : null;
}

export async function clearSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export const sessionCookieName = SESSION_COOKIE;
