"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import PostForm, { type PostFormValues } from "@/components/PostForm";
import { getPosts } from "@/app/mockdata";

const ADMIN_NAME = "Administrador"; // TODO: nome do admin logado

type Prop = {
  PostId: string
};

export default function EditPostPage({ PostId }: Prop) {
  const router = useRouter();
  

  // ── DADOS: buscar o post ──────────────────────────────
  // TODO: trocar por fetch GET /posts/{postId}
  const id = Number(PostId);
  const post = Number.isInteger(id)
    ? getPosts().find((p) => p.PostId === id && !p.DeletedAt)
    : undefined;
  // ──────────────────────────────────────────────────────

  if (!post) {
    return (
      <div className="min-h-full w-full bg-emerald-950 px-4 py-10 text-stone-100">
        <div className="mx-auto max-w-md rounded-xl border border-dashed border-emerald-700 p-8 text-center">
          <p className="font-semibold">Post não encontrado</p>
          <p className="mt-1 text-sm text-emerald-200/70">
            Ele pode ter sido excluído ou o endereço está incorreto.
          </p>
          <Link
            href="/admin/dashboard"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-amber-400 px-5 font-semibold text-emerald-950 transition-colors hover:bg-amber-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
          >
            Voltar ao painel
          </Link>
        </div>
      </div>
    );
  }

  const handleSave = (values: PostFormValues) => {
    // ── DADOS: salvar a edição ──────────────────────────
    // TODO: trocar por fetch PUT /posts/{postId}
    const posts = getPosts();
    const index = posts.findIndex((p) => p.PostId === post.PostId);
    const now = new Date();
    const firstPublish = values.Status === "PUBLICADO" && !post.PublishedAt;

    posts[index] = {
      ...post,
      ...values,
      PublishedAt: firstPublish ? now : post.PublishedAt,
      PublishedBy: firstPublish ? ADMIN_NAME : post.PublishedBy,
      UpdatedAt: now,
      UpdatedBy: ADMIN_NAME,
    };
    // ────────────────────────────────────────────────────

    router.push("/admin/dashboard");
  };

  return (
    <PostForm
      key={post.PostId}
      heading="Editar post"
      submitLabel="Salvar alterações"
      initialPost={post}
      onSave={handleSave}
    />
  );
}