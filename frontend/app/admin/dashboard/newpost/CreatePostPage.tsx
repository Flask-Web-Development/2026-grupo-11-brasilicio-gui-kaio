"use client";

import { useRouter } from "next/navigation";
import PostForm, { type PostFormValues } from "@/components/PostForm";
import { getPosts } from "@/app/mockdata";

const ADMIN_NAME = "Administrador"; // TODO: nome do admin logado

export default function CreatePostPage() {
  const router = useRouter();

  const handleSave = (values: PostFormValues) => {
    // ── DADOS: criar o post ─────────────────────────────
    // TODO: trocar por fetch POST /posts
    // Depois, mudar o sistema de IDs
    const posts = getPosts();
    const id = Math.max(0, ...posts.map((p) => p.PostId)) + 1;
    const now = new Date();
    const published = values.Status === "PUBLICADO";

    posts.unshift({
      PostId: id,
      Slug: String(id),
      ...values,
      PublishedAt: published ? now : null,
      PublishedBy: published ? ADMIN_NAME : null,
      UpdatedAt: null,
      UpdatedBy: null,
      DeletedAt: null,
      DeletedBy: null,
    });
    // ────────────────────────────────────────────────────

    router.push("/admin/dashboard");
  };

  return (
    <PostForm heading="Novo post" submitLabel="Criar post" onSave={handleSave} />
  );
}