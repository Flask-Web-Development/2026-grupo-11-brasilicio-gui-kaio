export enum OmbudsmanQuestionType {
  SUGESTAO = "SUGESTAO",
  RECLAMACAO = "RECLAMACAO",
  DUVIDA = "DUVIDA",
  DENUNCIA = "DENUNCIA",
  OUTRO = "OUTRO",
}

export enum OmbudsmanQuestionStatus {
  PENDENTE = "PENDENTE",
  RESPONDIDO = "RESPONDIDO",
  FECHADO = "FECHADO",
}

export type OmbudsmanQuestionBase = {
  ombudsman_question_id: string;
  user_id: string;
  title: string;
  content: string;
  type: OmbudsmanQuestionType;
  status: OmbudsmanQuestionStatus;
  created_at: string;
};

export type OmbudsmanQuestion = OmbudsmanQuestionBase & {
  updated_at: string | null;
  deleted_at: string | null;
};

export type OmbudsmanQuestionCreate = Pick<
  OmbudsmanQuestionBase,
  "title" | "content" | "type"
>;

export type OmbudsmanQuestionUpdate = Partial<
  Pick<OmbudsmanQuestionBase, "title" | "content" | "type">
>;

export type OmbudsmanMessageBase = {
  ombudsman_message_id: string;
  ombudsman_question_id: string;
  user_id: string;
  content: string;
  created_at: string;
};

export type OmbudsmanMessage = OmbudsmanMessageBase & {
  updated_at: string | null;
  deleted_at: string | null;
};

export type OmbudsmanMessageCreate = Pick<OmbudsmanMessageBase, "content">;

export type OmbudsmanMessageUpdate = Pick<OmbudsmanMessageBase, "content">;
