import { internalFetch } from "../client";
import type { UserLogin } from "@/types/user";

type SessionResponse = {
  ok: true;
};

export async function loginTraditional(payload: UserLogin): Promise<void> {
  await internalFetch<SessionResponse>("/api/auth/traditional", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginAdminMaster(payload: UserLogin): Promise<void> {
  await internalFetch<SessionResponse>("/api/auth/admin-master", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export type CurrentUser = {
  username: string | null;
  name: string | null;
  isAdmin: boolean;
  isAdminMaster: boolean;
};

// Quem está logado (lê a sessão no servidor) - null se não houver sessão.
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const response = await fetch("/api/auth/me");
  if (!response.ok) return null;
  return (await response.json()) as CurrentUser;
}

export async function logout(): Promise<void> {
  await internalFetch<SessionResponse>("/api/auth/logout", { method: "POST" });
}
