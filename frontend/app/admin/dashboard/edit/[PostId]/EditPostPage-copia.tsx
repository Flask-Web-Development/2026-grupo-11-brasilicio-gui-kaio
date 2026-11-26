"use client";

// COPIA MINIMALISTA de app/admin/dashboard/edit/[PostId]/EditPostPage.tsx (+ components/PostForm.tsx).
// Sem estilo, só integração com a API.
// Endpoints: GET /posts/{id} (getPost), PUT /posts/{id} (updatePost), GET /tags (getTags)
// Abrir no navegador: /dev/admin/posts/<post_id>/edit
// O PostId aqui é um UUID (str).
// Regras do backend:
//  - tags enviadas SUBSTITUEM as atuais (aqui sempre enviamos a lista inteira)
//  - voltar para RASCUNHO zera a data de publicação; publicar de novo gera data nova
//  - post na lixeira não pode ser editado (restaurar antes)

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getPost, updatePost } from "@/lib/api/endpoints/posts";
import { getTags } from "@/lib/api/endpoints/tags";
import { slugify } from "@/lib/slug";
import { PostStatus } from "@/types/post";
import type { Tag } from "@/types/tag";

const msg = (e: unknown) =>
  e instanceof Error ? e.message : "Erro desconhecido";

export default function EditPostPageCopia() {
  const router = useRouter();
  const { PostId } = useParams<{ PostId: string }>();

  const [loaded, setLoaded] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<PostStatus>(PostStatus.RASCUNHO);
  const [isFixed, setIsFixed] = useState(false);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!PostId) return;
    Promise.all([getPost(PostId), getTags()])
      .then(([post, tags]) => {
        setTitle(post.title);
        setSlug(post.slug);
        setSubtitle(post.subtitle ?? "");
        setContent(post.content);
        setStatus(post.status);
        setIsFixed(post.is_fixed);
        setSelectedTags(post.tags.map((t) => t.tag_id));
        setDeleted(post.deleted_at !== null);
        setAllTags(tags);
        setLoaded(true);
      })
      .catch((e) => setError(msg(e)));
  }, [PostId]);

  function toggleTag(id: string) {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  }

  function changeStatus(next: PostStatus) {
    setStatus(next);
    if (next !== PostStatus.PUBLICADO) setIsFixed(false); // backend recusa fixar rascunho
  }

  async function handleSubmit() {
    setError("");

    if (!title.trim() || !slug.trim() || !content.trim()) {
      setError("Título, slug e conteúdo são obrigatórios.");
      return;
    }

    setSaving(true);

    try {
      await updatePost(PostId, {
        slug: slug.trim(),
        title: title.trim(),
        subtitle: subtitle.trim() || null,
        content,
        is_fixed: isFixed,
        status,
        tags: selectedTags,
      });
      router.push("/dev/admin/posts"); // trocar para /admin/dashboard
    } catch (e) {
      setError(msg(e));
      setSaving(false);
    }
  }

  if (!loaded) return <p>{error ? `ERRO: ${error}` : "Carregando..."}</p>;

  return (
    <div>
      <h1>Editar post</h1>
      <p>
        <Link href="/dev/admin/posts">voltar</Link>
      </p>
      {deleted && (
        <p>ATENÇÃO: este post está na lixeira; o backend não deixa editar.</p>
      )}

      <p>
        Título:
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </p>

      <p>
        Slug (editável; mudar quebra links antigos):
        <input value={slug} onChange={(e) => setSlug(e.target.value)} />
        <button onClick={() => setSlug(slugify(title))}>
          gerar a partir do título
        </button>
      </p>

      <p>
        Subtítulo:
        <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
      </p>

      <p>Conteúdo:</p>
      <textarea
        rows={10}
        cols={60}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <p>
        Status:
        <select
          value={status}
          onChange={(e) => changeStatus(e.target.value as PostStatus)}
        >
          <option value={PostStatus.RASCUNHO}>RASCUNHO</option>
          <option value={PostStatus.PUBLICADO}>PUBLICADO</option>
        </select>
      </p>

      <p>
        <label>
          <input
            type="checkbox"
            checked={isFixed}
            disabled={status !== PostStatus.PUBLICADO}
            onChange={(e) => setIsFixed(e.target.checked)}
          />
          Fixar (só publicado)
        </label>
      </p>

      <p>Tags:</p>
      {allTags.map((t) => (
        <label key={t.tag_id}>
          <input
            type="checkbox"
            checked={selectedTags.includes(t.tag_id)}
            onChange={() => toggleTag(t.tag_id)}
          />
          {t.name}
        </label>
      ))}
      {allTags.length === 0 && <span>(nenhuma tag cadastrada)</span>}

      {error && <p>ERRO: {error}</p>}

      <p>
        <button onClick={handleSubmit} disabled={saving || deleted}>
          {saving ? "Salvando..." : "Salvar alterações"}
        </button>
      </p>
    </div>
  );
}
