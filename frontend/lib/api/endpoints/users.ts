import { apiFetch } from "../client";
import type { User, UserCreate, UserUpdate } from "@/types/user";

export const getUsers = () => apiFetch<User[]>("/users");

export const getUser = (userId: number) => apiFetch<User>(`/users/${userId}`);

export const createUser = (payload: UserCreate) =>
  apiFetch<User>("/users", { method: "POST", body: JSON.stringify(payload) });

export const updateUser = (userId: string, payload: UserUpdate) =>
  apiFetch<User>(`/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteUser = (userId: string) =>
  apiFetch<void>(`/users/${userId}`, { method: "DELETE" });
