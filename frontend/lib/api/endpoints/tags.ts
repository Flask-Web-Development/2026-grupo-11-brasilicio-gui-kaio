import { apiFetch } from "../client";
import type { Tag, TagCreate, TagUpdate } from "@/types/tag";

export const getTags = () => apiFetch<Tag[]>("/tags");

export const getTag = (tagId: string) =>
  apiFetch<Tag>(`/tags/${encodeURIComponent(tagId)}`);

export const createTag = (payload: TagCreate) =>
  apiFetch<Tag>("/tags", { method: "POST", body: JSON.stringify(payload) });

export const updateTag = (tagId: string, payload: TagUpdate) =>
  apiFetch<Tag>(`/tags/${encodeURIComponent(tagId)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteTag = (tagId: string) =>
  apiFetch<void>(`/tags/${encodeURIComponent(tagId)}`, { method: "DELETE" });
