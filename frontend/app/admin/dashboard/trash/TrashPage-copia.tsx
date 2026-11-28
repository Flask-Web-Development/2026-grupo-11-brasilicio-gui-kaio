"use client";

// SEM ORIGINAL (tela nova): lixeira de posts. Minimalista, sem estilo.
// Endpoints: GET /posts/trash (getPostTrash), POST /posts/{id}/restore (restorePost)
// Abrir no navegador: /dev/admin/trash
// Regras: posts excluídos ficam 60 dias aqui e depois são apagados de vez (o backend limpa sozinho).
// Restaurar devolve o post como RASCUNHO (não volta a aparecer no blog).

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPostTrash, restorePost } from "@/lib/api/endpoints/posts";
import type { Post } from "@/types/post";

const msg = (e: unknown) =>
  e instanceof Error ? e.message : "Erro desconhecido";
const fmt = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("pt-BR") : "-";

export default function TrashPageCopia() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);

    setError("");

    try {
      setPosts(await getPostTrash());
    } catch (e) {
      setError(msg(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleRestore(post: Post) {
    try {
      await restorePost(post.post_id);
      await load();
    } catch (e) {
      setError(msg(e));
    }
  }

  return (
    <div>
      <h1>Lixeira (60 dias)</h1>

      <p>
        <Link href="/dev/admin/posts">voltar</Link>
      </p>

      {error && <p>ERRO: {error}</p>}

      {loading && <p>Carregando...</p>}

      {posts.map((p) => (
        <div key={p.post_id}>
          <p>
            {p.title} (slug: {p.slug})
          </p>
          <p>
            excluído em: {fmt(p.deleted_at)} por: {p.deleted_by_name ?? "-"}
          </p>
          <p>
            <button onClick={() => handleRestore(p)}>
              Restaurar (volta como rascunho)
            </button>
          </p>
          <hr />
        </div>
      ))}

      {!loading && posts.length === 0 && !error && <p>Lixeira vazia.</p>}
    </div>
  );
}
