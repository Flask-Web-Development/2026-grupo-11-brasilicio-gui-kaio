import { apiFetch } from "../client";
import type { Image, ImageCreate, ImageUpdate } from "@/types/image";

export const getImages = () => apiFetch<Image[]>("/images");

export const getImageById = (imageId: string) =>
  apiFetch<Image>(`/images/${encodeURIComponent(imageId)}`);

export const createImage = (payload: ImageCreate) =>
  apiFetch<Image>("/images", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateImage = (imageId: string, payload: ImageUpdate) =>
  apiFetch<Image>(`/images/${encodeURIComponent(imageId)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteImage = (imageId: string, confirm = false) =>
  apiFetch<void>(
    `/images/${encodeURIComponent(imageId)}${confirm ? "?confirm=true" : ""}`,
    { method: "DELETE" },
  );
