"use client";

// COPIA MINIMALISTA de app/blog/BlogPage.tsx — sem estilo, só integração com a API.
// Endpoints: GET /posts/public (getPublicPosts) e GET /tags (getTags)
// Abrir no navegador: /dev/blog
// Paginação: a API começa na página 1 e devolve has_next. Aqui é botão "Carregar mais";
// trocar por scroll infinito chamando a mesma função load().

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPublicPosts } from "@/lib/api/endpoints/posts";
import { getTags } from "@/lib/api/endpoints/tags";
import type { PublicPost } from "@/types/post";
import type { Tag } from "@/types/tag";

const PER_PAGE = 9;
const msg = (e: unknown) =>
  e instanceof Error ? e.message : "Erro desconhecido";
const fmt = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("pt-BR") : "-";

export default function BlogPageCopia() {
  const [posts, setPosts] = useState<PublicPost[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [nextPage, setNextPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [tagId, setTagId] = useState("");

  // reset=true: nova busca (começa da página 1). reset=false: carrega a próxima página.
  async function load(page: number, reset: boolean) {
    setLoading(true);

    setError("");

    try {
      const data = await getPublicPosts({
        page,
        per_page: PER_PAGE,
        q,
        tag_id: tagId,
      });
      setPosts((prev) => (reset ? data.items : [...prev, ...data.items]));
      setTotal(data.total);
      setHasNext(data.has_next);
      setNextPage(data.page + 1);
    } catch (e) {
      setError(msg(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(1, true);
    getTags()
      .then(setTags)
      .catch(() => {});
  }, []);

  return (
    <div>
      <h1>Posts publicados</h1>

      <p>
        Busca: <input value={q} onChange={(e) => setQ(e.target.value)} />
        Tag:
        <select value={tagId} onChange={(e) => setTagId(e.target.value)}>
          <option value="">(todas)</option>
          {tags.map((t) => (
            <option key={t.tag_id} value={t.tag_id}>
              {t.name}
            </option>
          ))}
        </select>
        <button onClick={() => load(1, true)} disabled={loading}>
          Buscar
        </button>
      </p>

      <p>
        Mostrando {posts.length} de {total ?? "?"}
      </p>

      {error && <p>ERRO: {error}</p>}

      {posts.map((p) => (
        <div key={p.post_id}>
          {p.is_fixed && <p>[FIXADO]</p>}

          {/* trocar para a rota real do post, ex.: /blog/{slug} */}
          <p>
            <Link href={`/dev/blog/${encodeURIComponent(p.slug)}`}>
              {p.title}
            </Link>
          </p>

          <p>subtítulo: {p.subtitle ?? "-"}</p>

          {/* regra: nome de quem editou por último; se nunca editou, de quem publicou */}
          <p>
            autor: {p.updated_by_name ?? p.published_by_name ?? "(sem nome)"}
          </p>

          <p>publicado em: {fmt(p.published_at)}</p>

          <p>tags: {p.tags.map((t) => t.name).join(", ") || "-"}</p>

          <p>resumo (conteúdo cru): {p.content.slice(0, 120)}</p>
          <hr />
        </div>
      ))}

      {loading && <p>Carregando...</p>}

      {!loading && !error && posts.length === 0 && (
        <p>Nenhum post encontrado.</p>
      )}

      {hasNext && !loading && (
        <button onClick={() => load(nextPage, false)}>Carregar mais</button>
      )}
    </div>
  );
}
