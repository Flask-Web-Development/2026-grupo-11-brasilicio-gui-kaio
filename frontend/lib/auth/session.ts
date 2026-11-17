import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "ifpar_session";
const SESSION_MAX_AGE = 60 * 60 * 8;

export type AuthSession = {
  subject: string;
  accessToken?: string;
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

function getEncryptionKey() {
  return createHash("sha256").update(getSessionSecret()).digest();
}

function encode(session: AuthSession) {
  const payload = JSON.stringify(session);
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getEncryptionKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(payload, "utf8"),
    cipher.final(),
  ]);
  return [
    "v2",
    iv.toString("base64url"),
    cipher.getAuthTag().toString("base64url"),
    encrypted.toString("base64url"),
  ].join(".");
}

function decode(value: string): AuthSession | null {
  const parts = value.split(".");
  if (parts[0] === "v2" && parts.length === 4) {
    try {
      const decipher = createDecipheriv(
        "aes-256-gcm",
        getEncryptionKey(),
        Buffer.from(parts[1], "base64url"),
      );
      decipher.setAuthTag(Buffer.from(parts[2], "base64url"));
      const payload = Buffer.concat([
        decipher.update(Buffer.from(parts[3], "base64url")),
        decipher.final(),
      ]).toString("utf8");
      return parseSession(payload);
    } catch {
      return null;
    }
  }

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

  return parseSession(Buffer.from(payload, "base64url").toString("utf8"));
}

function parseSession(payload: string): AuthSession | null {
  try {
    const session = JSON.parse(payload) as AuthSession;
    if (
      typeof session.subject !== "string" ||
      typeof session.expiresAt !== "number" ||
      typeof session.isAdmin !== "boolean" ||
      (session.accessToken !== undefined &&
        typeof session.accessToken !== "string") ||
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
