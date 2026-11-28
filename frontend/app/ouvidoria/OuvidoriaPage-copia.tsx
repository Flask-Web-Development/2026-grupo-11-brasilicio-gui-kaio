"use client";

// SEM ORIGINAL (tela nova): Ouvidoria do usuário logado (aluno OU admin usando como aluno).
// Minimalista, sem estilo.
// Endpoints: GET /ombudsman/questions (getQuestions), POST /ombudsman/questions (createQuestion)
// Abrir no navegador: /dev/ouvidoria  (precisa estar logado com conta SUAP; Admin Master não pode)
// Regras: o aluno só vê as próprias solicitações; ocultas não aparecem; toda nova começa PENDENTE.

import { useEffect, useState } from "react";
import Link from "next/link";
import { createQuestion, getQuestions } from "@/lib/api/endpoints/ombudsman";
import {
  OmbudsmanQuestionType,
  type OmbudsmanQuestion,
} from "@/types/ombudsman";

const msg = (e: unknown) =>
  e instanceof Error ? e.message : "Erro desconhecido";
const fmt = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("pt-BR") : "-";

export default function OuvidoriaPageCopia() {
  const [questions, setQuestions] = useState<OmbudsmanQuestion[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<OmbudsmanQuestionType>(
    OmbudsmanQuestionType.DUVIDA,
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);

    try {
      setQuestions(await getQuestions());
    } catch (e) {
      setError(msg(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate() {
    setError("");

    if (!title.trim() || !content.trim()) {
      setError("Título e conteúdo são obrigatórios.");
      return;
    }

    try {
      await createQuestion({
        title: title.trim(),
        content: content.trim(),
        type,
      });
      setTitle("");
      setContent("");
      await load();
    } catch (e) {
      setError(msg(e));
    }
  }

  return (
    <div>
      <h1>Ouvidoria: minhas solicitações</h1>
      <p>
        <Link href="/dev">Índice</Link>
      </p>

      <h2>Nova solicitação</h2>

      <p>
        Título:{" "}
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </p>

      <p>
        Tipo:
        <select
          value={type}
          onChange={(e) => setType(e.target.value as OmbudsmanQuestionType)}
        >
          {Object.values(OmbudsmanQuestionType).map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </p>

      <textarea
        rows={5}
        cols={50}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <p>
        <button onClick={handleCreate}>Enviar</button>
      </p>

      {error && <p>ERRO: {error}</p>}

      <hr />

      {loading && <p>Carregando...</p>}

      {questions.map((q) => (
        <p key={q.ombudsman_question_id}>
          [{q.status}] [{q.type}]{/* trocar pela rota real do detalhe */}
          <Link href={`/dev/ouvidoria/${q.ombudsman_question_id}`}>
            {q.title}
          </Link>
          — criada em {fmt(q.created_at)}
        </p>
      ))}

      {!loading && questions.length === 0 && <p>Nenhuma solicitação.</p>}
    </div>
  );
}
