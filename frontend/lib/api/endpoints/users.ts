import { apiFetch } from "../client";
import type { User, UserRoleUpdate, UserUpdate } from "@/types/user";

export const getUsers = () => apiFetch<User[]>("/users");

export const getUser = (userId: string) =>
  apiFetch<User>(`/users/${encodeURIComponent(userId)}`);

export const updateUser = (userId: string, payload: UserUpdate) =>
  apiFetch<User>(`/users/${encodeURIComponent(userId)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const updateUserRole = (userId: string, payload: UserRoleUpdate) =>
  apiFetch<User>(`/users/${encodeURIComponent(userId)}/role`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
