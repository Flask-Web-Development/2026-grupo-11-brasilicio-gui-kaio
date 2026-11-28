import type { Tag } from "./tag";

export enum PostStatus {
  RASCUNHO = "RASCUNHO",
  PUBLICADO = "PUBLICADO",
}

export enum PostImageUsageType {
  THUMBNAIL = "THUMBNAIL",
  CONTENT = "CONTENT",
}

export type PostImageCreate = {
  image_id: string;
  usage_type?: PostImageUsageType;
  position?: number | null;
  width?: number | null;
  height?: number | null;
  alt?: string | null;
};

export type PostImage = {
  post_image_id: string;
  image_id: string | null;
  usage_type: PostImageUsageType;
  position: number | null;
  width: number | null;
  height: number | null;
  alt: string | null;
};

export type PostCreate = {
  slug: string;
  title: string;
  subtitle?: string | null;
  content: string;
  is_fixed?: boolean;
  status?: PostStatus;
  tags?: string[];
  images?: PostImageCreate[];
};

export type PostUpdate = {
  slug?: string;
  title?: string;
  subtitle?: string | null;
  content?: string;
  is_fixed?: boolean;
  status?: PostStatus;
  tags?: string[];
  images?: PostImageCreate[];
};

export type Post = {
  post_id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  content: string;
  is_fixed: boolean;
  status: PostStatus;
  tags: Tag[];
  post_images: PostImage[];
  published_at: string | null;
  published_by: string | null;
  published_by_name: string | null;
  updated_at: string | null;
  updated_by: string | null;
  updated_by_name: string | null;
  deleted_at: string | null;
  deleted_by: string | null;
  deleted_by_name: string | null;
};

export type PublicPost = Pick<
  Post,
  | "post_id"
  | "slug"
  | "title"
  | "subtitle"
  | "content"
  | "is_fixed"
  | "status"
  | "tags"
  | "post_images"
  | "published_at"
  | "published_by_name"
  | "updated_at"
  | "updated_by_name"
  | "deleted_at"
  | "deleted_by_name"
>;

export type PostPage = {
  items: PublicPost[];
  page: number;
  per_page: number;
  total: number;
  has_next: boolean;
};

export type PostDashboard = {
  total: number;
  published: number;
  drafts: number;
  recent_posts: Post[];
};
