from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import String, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from uuid import UUID, uuid4

from ..database import db

if TYPE_CHECKING:
    from .post import Post

class Tag(db.Model):
    __tablename__ = "Tag"

    tag_id: Mapped[UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid4, nullable=False)
    name: Mapped[str] = mapped_column(String, unique=True, nullable=False)

    posts: Mapped[list["Post"]] = relationship(secondary="Mapping_Post_Tag", back_populates="tags")

    def get_tag_id(self) -> UUID:
        return self.tag_id
