import { internalFetch } from "../client";
import type { LoginResponse, UserLogin } from "@/types/user";
import { userLogin } from "./users";

type SessionResponse = {
  ok: true;
};

export async function loginTraditional(
  payload: UserLogin,
): Promise<LoginResponse> {
  const response = await userLogin(payload);
  if (!response.access_token) {
    throw new Error("Token de autenticação não retornado");
  }

  await internalFetch<SessionResponse>("/api/auth/traditional", {
    method: "POST",
    body: JSON.stringify({ accessToken: response.access_token }),
  });

  return response;
}
