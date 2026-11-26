"use client";

// SEM ORIGINAL (tela nova): detalhe/conversa de uma solicitação. Serve para ALUNO e para ADMIN
// (o papel vem de getCurrentUser(); o backend é quem realmente valida cada ação). Minimalista, sem estilo.
// Endpoints: GET /ombudsman/questions/{id}, GET .../messages, POST .../messages,
//            PUT /ombudsman/questions/{id}, PUT /ombudsman/messages/{id}, DELETE /ombudsman/questions/{id}
//            (e GET /users/{id} para o admin ver os dados do solicitante)
// Abrir no navegador: /dev/ouvidoria/<id>  (aluno)  ou  /dev/admin/ouvidoria/<id>  (admin)
// Regras de status (feitas pelo backend):
//   admin responde -> RESPONDIDO | aluno envia mensagem -> PENDENTE (reabre se estava FECHADO)
//   DELETE na solicitação: para ADMIN = FECHAR; para ALUNO = OCULTAR (definitivo, vira FECHADO)
//   solicitação oculta não aceita mensagens novas.
// Só o autor edita a própria mensagem. A mensagem não traz o papel do autor: quem tem o mesmo
// user_id do solicitante é o "solicitante"; qualquer outro é "administração".

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  createMessage,
  deleteQuestion,
  getQuestionById,
  getQuestionMessages,
  updateMessage,
  updateQuestion,
} from "@/lib/api/endpoints/ombudsman";
import { getCurrentUser, type CurrentUser } from "@/lib/api/endpoints/auth";
import { getUser } from "@/lib/api/endpoints/users";
import type { OmbudsmanMessage, OmbudsmanQuestion } from "@/types/ombudsman";
import type { User } from "@/types/user";

const msg = (e: unknown) =>
  e instanceof Error ? e.message : "Erro desconhecido";
const fmt = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("pt-BR") : "-";

export default function QuestionPageCopia() {
  const router = useRouter();
  const { QuestionId } = useParams<{ QuestionId: string }>();

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [question, setQuestion] = useState<OmbudsmanQuestion | null>(null);
  const [messages, setMessages] = useState<OmbudsmanMessage[]>([]);
  const [requester, setRequester] = useState<User | null>(null);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const [meData, q, m] = await Promise.all([
        getCurrentUser(),
        getQuestionById(QuestionId),
        getQuestionMessages(QuestionId),
      ]);
      setUser(meData);
      setQuestion(q);
      setMessages(m);
      // admin consulta os dados de identificação do solicitante
      if (meData?.isAdmin)
        getUser(q.user_id)
          .then(setRequester)
          .catch(() => {});
    } catch (e) {
      setError(msg(e));
    }
  }, [QuestionId]);

  useEffect(() => {
    if (QuestionId) load();
  }, [QuestionId, load]);

  async function handleSend() {
    setError("");
    if (!text.trim()) return;
    try {
      await createMessage(QuestionId, { content: text.trim() });
      setText("");
      await load();
    } catch (e) {
      setError(msg(e));
    }
  }

  async function handleEditMessage(m: OmbudsmanMessage) {
    const next = window.prompt("Editar mensagem", m.content);
    if (!next || !next.trim() || next === m.content) return;
    try {
      await updateMessage(m.ombudsman_message_id, { content: next.trim() });
      await load();
    } catch (e) {
      setError(msg(e));
    }
  }

  async function handleEditQuestion() {
    if (!question) return;
    const next = window.prompt("Editar texto da solicitação", question.content);
    if (!next || !next.trim() || next === question.content) return;
    try {
      await updateQuestion(QuestionId, { content: next.trim() });
      await load();
    } catch (e) {
      setError(msg(e));
    }
  }

  // Mesmo endpoint, efeito diferente conforme o papel: admin fecha, aluno oculta.
  async function handleCloseOrHide() {
    const admin = user?.isAdmin === true;
    const ask = admin
      ? "Fechar esta solicitação?"
      : "Ocultar esta solicitação? Isso é definitivo para você.";
    if (!window.confirm(ask)) return;
    try {
      await deleteQuestion(QuestionId);
      if (admin) await load();
      else router.push("/dev/ouvidoria"); // trocar pela rota real da lista
    } catch (e) {
      setError(msg(e));
    }
  }

  if (!question) return <p>{error ? `ERRO: ${error}` : "Carregando..."}</p>;

  const isAdmin = user?.isAdmin === true;
  const isOwner = user?.username === question.user_id;
  const hidden = question.deleted_at !== null;
  const backHref = isAdmin ? "/dev/admin/ouvidoria" : "/dev/ouvidoria"; // trocar pelas rotas reais

  return (
    <div>
      <p>
        <Link href={backHref}>voltar</Link>
      </p>
      <h1>{question.title}</h1>
      <p>
        status: {question.status} | tipo: {question.type} | criada em:{" "}
        {fmt(question.created_at)}
      </p>
      {hidden && <p>(oculta pelo aluno: não aceita novas mensagens)</p>}

      {isAdmin && (
        <p>
          solicitante: {requester?.name ?? "(sem nome)"} — matrícula{" "}
          {question.user_id} —{requester?.email ?? "-"} —{" "}
          {requester?.course ?? "-"}
        </p>
      )}

      <p>Mensagem inicial:</p>
      <pre style={{ whiteSpace: "pre-wrap" }}>{question.content}</pre>
      {isOwner && !hidden && (
        <button onClick={handleEditQuestion}>Editar solicitação</button>
      )}

      <h2>Conversa</h2>
      {messages.map((m) => (
        <div key={m.ombudsman_message_id}>
          <p>
            {m.user_id === question.user_id ? "SOLICITANTE" : "ADMINISTRAÇÃO"} (
            {m.user_id}) —{fmt(m.created_at)}{" "}
            {m.updated_at && `(editada em ${fmt(m.updated_at)})`}
          </p>
          <pre style={{ whiteSpace: "pre-wrap" }}>{m.content}</pre>
          {m.user_id === user?.username && !hidden && (
            <button onClick={() => handleEditMessage(m)}>Editar</button>
          )}
          <hr />
        </div>
      ))}
      {messages.length === 0 && <p>Nenhuma mensagem ainda.</p>}

      {!hidden && (
        <>
          <textarea
            rows={4}
            cols={50}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <p>
            <button onClick={handleSend}>Enviar mensagem</button>
          </p>
        </>
      )}

      {error && <p>ERRO: {error}</p>}

      {!hidden && (isAdmin ? question.status !== "FECHADO" : isOwner) && (
        <p>
          <button onClick={handleCloseOrHide}>
            {isAdmin ? "Fechar solicitação" : "Ocultar solicitação"}
          </button>
        </p>
      )}
    </div>
  );
}
