import { apiFetch } from "../client";
import type {
  OmbudsmanQuestion,
  OmbudsmanQuestionCreate,
  OmbudsmanQuestionUpdate,
  OmbudsmanMessage,
  OmbudsmanMessageCreate,
  OmbudsmanMessageUpdate,
} from "@/types/ombudsman";

export const getQuestions = () =>
  apiFetch<OmbudsmanQuestion[]>("/ombudsman/questions");

export const getQuestionById = (questionId: string) =>
  apiFetch<OmbudsmanQuestion>(
    `/ombudsman/questions/${encodeURIComponent(questionId)}`,
  );

export const createQuestion = (payload: OmbudsmanQuestionCreate) =>
  apiFetch<OmbudsmanQuestion>("/ombudsman/questions", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateQuestion = (
  questionId: string,
  payload: OmbudsmanQuestionUpdate,
) =>
  apiFetch<OmbudsmanQuestion>(
    `/ombudsman/questions/${encodeURIComponent(questionId)}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
  );

export const deleteQuestion = (questionId: string) =>
  apiFetch<void>(`/ombudsman/questions/${encodeURIComponent(questionId)}`, {
    method: "DELETE",
  });

export const getQuestionMessages = (questionId: string) =>
  apiFetch<OmbudsmanMessage[]>(
    `/ombudsman/questions/${encodeURIComponent(questionId)}/messages`,
  );

export const createMessage = (
  questionId: string,
  payload: OmbudsmanMessageCreate,
) =>
  apiFetch<OmbudsmanMessage>(
    `/ombudsman/questions/${encodeURIComponent(questionId)}/messages`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );

export const getMessageById = (messageId: string) =>
  apiFetch<OmbudsmanMessage>(
    `/ombudsman/messages/${encodeURIComponent(messageId)}`,
  );

export const updateMessage = (
  messageId: string,
  payload: OmbudsmanMessageUpdate,
) =>
  apiFetch<OmbudsmanMessage>(
    `/ombudsman/messages/${encodeURIComponent(messageId)}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
  );

export const deleteMessage = (messageId: string) =>
  apiFetch<void>(`/ombudsman/messages/${encodeURIComponent(messageId)}`, {
    method: "DELETE",
  });
