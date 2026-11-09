from __future__ import annotations

from sqlalchemy import DateTime, ForeignKey, Text, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from ..database import db

if TYPE_CHECKING:
    from .ombudsman_question import OmbudsmanQuestion
    from .user import User

class OmbudsmanMessage(db.Model):
    __tablename__ = "Ombudsman_Message"

    ombudsman_message_id: Mapped[UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid4, nullable=False)
    ombudsman_question_id: Mapped[UUID] = mapped_column(ForeignKey("Ombudsman_Question.ombudsman_question_id"), nullable=False)
    user_id: Mapped[str] = mapped_column(ForeignKey("User.user_id"), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.now, nullable=False)
    updated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True, onupdate=datetime.now)
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    question: Mapped["OmbudsmanQuestion"] = relationship(back_populates="messages")

    user: Mapped["User"] = relationship(back_populates="ombudsman_messages")

    def get_ombudsman_message_id(self) -> UUID:
        return self.ombudsman_message_id
