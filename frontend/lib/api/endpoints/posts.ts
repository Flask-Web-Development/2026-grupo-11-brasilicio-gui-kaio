import { apiFetch } from "../client";
import type {
  Post,
  PostCreate,
  PostDashboard,
  PostPage,
  PublicPost,
  PostUpdate,
} from "@/types/post";

export const getPosts = () => apiFetch<Post[]>("/posts");

export const getPost = (postId: string) =>
  apiFetch<Post>(`/posts/${encodeURIComponent(postId)}`);

export const createPost = (payload: PostCreate) =>
  apiFetch<Post>("/posts", { method: "POST", body: JSON.stringify(payload) });

export const updatePost = (postId: string, payload: PostUpdate) =>
  apiFetch<Post>(`/posts/${encodeURIComponent(postId)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deletePost = (postId: string) =>
  apiFetch<void>(`/posts/${encodeURIComponent(postId)}`, { method: "DELETE" });

export const restorePost = (postId: string) =>
  apiFetch<Post>(`/posts/${encodeURIComponent(postId)}/restore`, {
    method: "POST",
  });

export const getPostDashboard = () =>
  apiFetch<PostDashboard>("/posts/dashboard");

export const getPostTrash = () => apiFetch<Post[]>("/posts/trash");

export const getPublicPosts = (params: {
  page?: number;
  per_page?: number;
  q?: string;
  tag_id?: string;
} = {}) => {
  const query = new URLSearchParams();
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.per_page !== undefined) {
    query.set("per_page", String(params.per_page));
  }
  if (params.q) query.set("q", params.q);
  if (params.tag_id) query.set("tag_id", params.tag_id);
  const queryString = query.toString();
  const suffix = queryString ? `?${queryString}` : "";
  return apiFetch<PostPage>(`/posts/public${suffix}`);
};

export const getPublicPost = (slug: string) =>
  apiFetch<PublicPost>(`/posts/public/${encodeURIComponent(slug)}`);
