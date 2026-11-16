from __future__ import annotations

import enum
from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from sqlalchemy import Enum, ForeignKey, String, Text, Uuid, CheckConstraint, func, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import  db,UTCDateTime, utc_now

if TYPE_CHECKING:
    from .ombudsman_message import OmbudsmanMessage
    from .user import User

class Type(enum.StrEnum):
    SUGESTAO = "SUGESTAO"
    RECLAMACAO = "RECLAMACAO"
    DUVIDA = "DUVIDA"
    DENUNCIA = "DENUNCIA"
    OUTRO = "OUTRO"

class Status(enum.StrEnum):
    PENDENTE = "PENDENTE"
    RESPONDIDO = "RESPONDIDO"
    FECHADO = "FECHADO"

class OmbudsmanQuestion(db.Model):
    __tablename__ = "Ombudsman_Question"
    __table_args__ = (
        CheckConstraint("deleted_at IS NULL OR status = 'FECHADO'", "ombudsman_question_deleted_closed_check"),
    )

    ombudsman_question_id: Mapped[UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid4, nullable=False)
    user_id: Mapped[str] = mapped_column(ForeignKey("User.user_id"), nullable=False)
    title: Mapped[str] = mapped_column(String, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    type: Mapped[Type] = mapped_column(Enum(Type, values_callable=lambda obj: [item.value for item in obj], native_enum=False, create_constraint=True), nullable=False, comment='Enum: "SUGESTAO", "RECLAMACAO", "DUVIDA", "DENUNCIA", "OUTRO"')
    status: Mapped[Status] = mapped_column(Enum(Status, values_callable=lambda obj: [item.value for item in obj], native_enum=False, create_constraint=True), default=Status.PENDENTE, server_default=text("'PENDENTE'"), nullable=False, comment='Enum: "PENDENTE", "RESPONDIDO", "FECHADO"')
    
    created_at: Mapped[datetime] = mapped_column(UTCDateTime(), default=utc_now, server_default=func.current_timestamp(), nullable=False)
    updated_at: Mapped[datetime | None] = mapped_column(UTCDateTime(), nullable=True, onupdate=utc_now)
    deleted_at: Mapped[datetime | None] = mapped_column(UTCDateTime(), nullable=True)

    messages: Mapped[list["OmbudsmanMessage"]] = relationship(back_populates="question", cascade="save-update, merge")

    user: Mapped["User"] = relationship(back_populates="ombudsman_questions")

    def get_ombudsman_question_id(self) -> UUID:
        return self.ombudsman_question_id
