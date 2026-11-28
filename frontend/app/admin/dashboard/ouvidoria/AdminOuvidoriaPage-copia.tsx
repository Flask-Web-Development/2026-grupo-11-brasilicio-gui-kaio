"use client";

// SEM ORIGINAL (tela nova): Ouvidoria no painel admin — TODAS as solicitações. Minimalista, sem estilo.
// Endpoint: GET /ombudsman/questions (getQuestions) — para ADMIN o backend devolve de todos os
// usuários, inclusive as ocultadas pelo aluno (deleted_at preenchido).
// Abrir no navegador: /dev/admin/ouvidoria
// Filtro por status aqui é só no front (o backend não filtra).

import { useEffect, useState } from "react";
import Link from "next/link";
import { getQuestions } from "@/lib/api/endpoints/ombudsman";
import {
  OmbudsmanQuestionStatus,
  type OmbudsmanQuestion,
} from "@/types/ombudsman";

const msg = (e: unknown) =>
  e instanceof Error ? e.message : "Erro desconhecido";
const fmt = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("pt-BR") : "-";

export default function AdminOuvidoriaPageCopia() {
  const [questions, setQuestions] = useState<OmbudsmanQuestion[]>([]);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getQuestions()
      .then(setQuestions)
      .catch((e) => setError(msg(e)))
      .finally(() => setLoading(false));
  }, []);

  const visible = filter
    ? questions.filter((q) => q.status === filter)
    : questions;

  return (
    <div>
      <h1>Ouvidoria: todas as solicitações</h1>
      <p>
        <Link href="/dev">Índice</Link>
      </p>

      <p>
        Status:
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">(todos)</option>
          {Object.values(OmbudsmanQuestionStatus).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </p>

      {error && <p>ERRO: {error}</p>}
      {loading && <p>Carregando...</p>}

      {visible.map((q) => (
        <p key={q.ombudsman_question_id}>
          [{q.status}] [{q.type}] {q.deleted_at && "[OCULTA PELO ALUNO] "}
          {/* trocar pela rota real do detalhe admin */}
          <Link href={`/dev/admin/ouvidoria/${q.ombudsman_question_id}`}>
            {q.title}
          </Link>
          — solicitante: {q.user_id} — {fmt(q.created_at)}
        </p>
      ))}
      {!loading && visible.length === 0 && !error && (
        <p>Nenhuma solicitação.</p>
      )}
    </div>
  );
}
