"use client";

// COPIA MINIMALISTA de app/blog/[PostId]/PostPage.tsx — sem estilo, só integração com a API.
// Endpoint: GET /posts/public/{slug} (getPublicPost)
// Abrir no navegador: /dev/blog/<slug>
// ATENÇÃO: a rota real precisa usar o SLUG (a pasta hoje se chama [PostId], com id numérico do mock).
// Esta cópia aceita tanto o parâmetro "slug" quanto "PostId" para funcionar nos dois casos.

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getPublicPost } from "@/lib/api/endpoints/posts";
import type { PublicPost } from "@/types/post";

const msg = (e: unknown) =>
  e instanceof Error ? e.message : "Erro desconhecido";
const fmt = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("pt-BR") : "-";

export default function PostPageCopia() {
  const params = useParams<{ slug?: string; PostId?: string }>();
  const slug = params.slug ?? params.PostId ?? "";

  const [post, setPost] = useState<PublicPost | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;

    getPublicPost(slug)
      .then(setPost)
      .catch((e) => setError(msg(e)));
  }, [slug]);

  if (error) return <p>ERRO: {error}</p>;

  if (!post) return <p>Carregando...</p>;

  return (
    <div>
      {/* trocar para a rota real da lista, ex.: /blog */}
      <p>
        <Link href="/dev/blog">voltar</Link>
      </p>

      <h1>{post.title}</h1>

      <p>subtítulo: {post.subtitle ?? "-"}</p>

      <p>
        autor: {post.updated_by_name ?? post.published_by_name ?? "(sem nome)"}
      </p>

      <p>publicado em: {fmt(post.published_at)}</p>

      <p>atualizado em: {fmt(post.updated_at)}</p>

      <p>fixado: {post.is_fixed ? "sim" : "não"}</p>

      <p>tags: {post.tags.map((t) => t.name).join(", ") || "-"}</p>

      <pre style={{ whiteSpace: "pre-wrap" }}>{post.content}</pre>
    </div>
  );
}
