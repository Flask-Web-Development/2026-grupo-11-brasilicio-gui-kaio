import { apiFetch } from "../client";
import type { Tag, TagCreate, TagUpdate } from "@/types/tag";

export const getTags = () => apiFetch<Tag[]>("/tags");

export const getTag = (tagId: number) => apiFetch<Tag>(`/tags/${tagId}`);

export const createTag = (payload: TagCreate) =>
  apiFetch<Tag>("/tags", { method: "POST", body: JSON.stringify(payload) });

export const updateTag = (tagId: number, payload: TagUpdate) =>
  apiFetch<Tag>(`/tags/${tagId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteTag = (tagId: number) =>
  apiFetch<void>(`/tags/${tagId}`, { method: "DELETE" });
