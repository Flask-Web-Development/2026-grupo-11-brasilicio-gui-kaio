import { internalFetch } from "../client";
import type { UserLogin } from "@/types/user";

type SessionResponse = {
  ok: true;
};

export async function loginTraditional(
  payload: UserLogin,
): Promise<void> {
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
