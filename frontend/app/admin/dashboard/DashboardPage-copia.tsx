"use client";

// COPIA MINIMALISTA de app/admin/dashboard/DashboardPage.tsx — sem estilo, só integração com a API.
// Endpoints: GET /posts (getPosts), GET /posts/dashboard (getPostDashboard), DELETE /posts/{id} (deletePost)
// Abrir no navegador: /dev/admin/posts  (precisa estar logado como ADMIN com conta SUAP)
// Excluir = exclusão lógica: vai para a lixeira por 60 dias (ver TrashPage-copia.tsx).

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  deletePost,
  getPostDashboard,
  getPosts,
} from "@/lib/api/endpoints/posts";
import type { Post, PostDashboard } from "@/types/post";

const msg = (e: unknown) =>
  e instanceof Error ? e.message : "Erro desconhecido";
const fmt = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("pt-BR") : "-";

export default function DashboardPageCopia() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState<PostDashboard | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [p, s] = await Promise.all([getPosts(), getPostDashboard()]);
      setPosts(p);
      setStats(s);
    } catch (e) {
      setError(msg(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(post: Post) {
    if (!window.confirm(`Mover "${post.title}" para a lixeira?`)) return;
    try {
      await deletePost(post.post_id);
      await load();
    } catch (e) {
      setError(msg(e));
    }
  }

  return (
    <div>
      <h1>Painel: posts</h1>
      {/* trocar pelas rotas reais: /admin/dashboard/newpost, /admin/dashboard/trash, /admin/dashboard/edit/{id} */}
      <p>
        <Link href="/dev/admin/posts/new">Novo post</Link> |
        <Link href="/dev/admin/trash">Lixeira</Link> |
        <Link href="/dev">Índice</Link>
      </p>

      {stats && (
        <p>
          Total: {stats.total} | Publicados: {stats.published} | Rascunhos:{" "}
          {stats.drafts}
        </p>
      )}
      {error && <p>ERRO: {error}</p>}
      {loading && <p>Carregando...</p>}

      {posts.map((p) => (
        <div key={p.post_id}>
          <p>
            [{p.status}] {p.is_fixed && "[FIXADO] "}
            {p.title} (slug: {p.slug})
          </p>
          <p>
            publicado por: {p.published_by_name ?? "-"} em {fmt(p.published_at)}{" "}
            | editado por:
            {p.updated_by_name ?? "-"} em {fmt(p.updated_at)}
          </p>
          <p>tags: {p.tags.map((t) => t.name).join(", ") || "-"}</p>
          <p>
            <Link href={`/dev/admin/posts/${p.post_id}/edit`}>Editar</Link>
            <button onClick={() => handleDelete(p)}>Excluir</button>
            {p.status === "PUBLICADO" && (
              <>
                {" "}
                <Link href={`/dev/blog/${encodeURIComponent(p.slug)}`}>
                  Ver no blog
                </Link>
              </>
            )}
          </p>
          <hr />
        </div>
      ))}
      {!loading && posts.length === 0 && !error && <p>Nenhum post.</p>}
    </div>
  );
}
