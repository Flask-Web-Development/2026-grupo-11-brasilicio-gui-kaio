import type { Tag } from "./tag";
import type { Image } from "./image";

export enum PostStatus {
  RASCUNHO = "Rascunho",
  PUBLICADO = "Publicado",
  OCULTO = "Oculto",
  APAGADO = "Apagado",
}

// PostBase
interface PostBase {
  title: string;
  subtitle: string;
  content: string;
  slug: string;
  is_fixed: boolean;
  status: PostStatus;
}

// PostCreate
export type PostCreate = PostBase & {
  thumbnail: Image;
  images: Image[];
};

// PostUpdate (tudo opcional)
export type PostUpdate = Partial<PostBase> & {
  thumbnail?: Image;
  images?: Image[];
};

// PostResponse
export type Post = PostBase & {
  id: number;
  created_by_id: number;
  created_at: string;
  updated_at: string | null;
  updated_by: number | null;
  tags: Tag[];
  thumbnail: Image;
  images: Image[];
};
