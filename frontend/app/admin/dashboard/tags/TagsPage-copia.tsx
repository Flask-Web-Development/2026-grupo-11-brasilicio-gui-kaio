"use client";

// SEM ORIGINAL (tela nova): gerenciamento de tags. Minimalista, sem estilo.
// Endpoints: GET /tags, POST /tags, PUT /tags/{id}, DELETE /tags/{id}
// (getTags, createTag, updateTag, deleteTag)  — GET é público; o resto exige ADMIN SUAP.
// Abrir no navegador: /dev/admin/tags
// Renomear usa window.prompt só para economizar código; o dev front pode trocar por input/modal.

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  createTag,
  deleteTag,
  getTags,
  updateTag,
} from "@/lib/api/endpoints/tags";
import type { Tag } from "@/types/tag";

const msg = (e: unknown) =>
  e instanceof Error ? e.message : "Erro desconhecido";

export default function TagsPageCopia() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try {
      setTags(await getTags());
    } catch (e) {
      setError(msg(e));
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate() {
    setError("");

    if (!name.trim()) return;

    try {
      await createTag({ name: name.trim() });
      setName("");
      await load();
    } catch (e) {
      setError(msg(e));
    }
  }

  async function handleRename(tag: Tag) {
    const next = window.prompt("Novo nome da tag", tag.name);

    if (!next || !next.trim() || next === tag.name) return;

    try {
      await updateTag(tag.tag_id, { name: next.trim() });
      await load();
    } catch (e) {
      setError(msg(e));
    }
  }

  async function handleDelete(tag: Tag) {
    if (!window.confirm(`Excluir a tag "${tag.name}"?`)) return;

    try {
      await deleteTag(tag.tag_id);
      await load();
    } catch (e) {
      setError(msg(e));
    }
  }

  return (
    <div>
      <h1>Tags</h1>
      <p>
        <Link href="/dev">Índice</Link>
      </p>

      <p>
        Nova tag:
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={handleCreate}>Criar</button>
      </p>

      {error && <p>ERRO: {error}</p>}

      {tags.map((t) => (
        <p key={t.tag_id}>
          {t.name} <button onClick={() => handleRename(t)}>Renomear</button>
          <button onClick={() => handleDelete(t)}>Excluir</button>
        </p>
      ))}

      {tags.length === 0 && !error && <p>Nenhuma tag.</p>}
    </div>
  );
}
