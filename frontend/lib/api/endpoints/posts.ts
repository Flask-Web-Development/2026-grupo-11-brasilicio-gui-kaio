import { apiFetch } from "../client";
import type { Post, PostCreate, PostUpdate } from "@/types/post";

export const getPosts = () => apiFetch<Post[]>("/posts");

export const getPost = (postId: number) => apiFetch<Post>(`/posts/${postId}`);

export const createPost = (payload: PostCreate) =>
  apiFetch<Post>("/posts", { method: "POST", body: JSON.stringify(payload) });

export const updatePost = (postId: number, payload: PostUpdate) =>
  apiFetch<Post>(`/posts/${postId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deletePost = (postId: number) =>
  apiFetch<void>(`/posts/${postId}`, { method: "DELETE" });
