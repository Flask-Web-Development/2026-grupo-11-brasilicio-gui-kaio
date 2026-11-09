from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Enum, Boolean, CheckConstraint, DateTime, String, Text, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from datetime import datetime
import enum

from uuid import UUID, uuid4

from ..database import db
from .post_image import post_image
from .image import Image
from .post_image import PostImage
from .tag import Tag

if TYPE_CHECKING:
    from .user import User

class Status(enum.StrEnum):
    RASCUNHO = "RASCUNHO"
    PUBLICADO = "PUBLICADO"

class Post(db.Model):
    __tablename__ = "Post"
    __table_args__ = (
        CheckConstraint("is_fixed = false OR (status = 'PUBLICADO' AND deleted_at IS NULL)", "post_fixed_check").ddl_if("postgresql"),
    )

    post_id: Mapped[UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid4, nullable=False)
    slug: Mapped[str] = mapped_column(Text, unique=True, nullable=False)
    title: Mapped[str] = mapped_column(String, nullable=False)
    subtitle: Mapped[str | None] = mapped_column(String, nullable=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    is_fixed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    status: Mapped[Status] = mapped_column(Enum(Status, values_callable=lambda obj: [item.value for item in obj], native_enum=False, create_constraint=True), default=Status.RASCUNHO, nullable=False)

    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    published_by: Mapped[str | None] = mapped_column(ForeignKey("User.user_id"), nullable=True)

    updated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True, onupdate=datetime.now)
    updated_by: Mapped[str | None] = mapped_column(ForeignKey("User.user_id"), nullable=True)

    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    deleted_by: Mapped[str | None] = mapped_column(ForeignKey("User.user_id"), nullable=True)

    tags: Mapped[list["Tag"]] = relationship(secondary="Mapping_Post_Tag", back_populates="posts")

    post_images: Mapped[list["PostImage"]] = relationship(back_populates="post", cascade="all, delete-orphan")
    images: Mapped[list["Image"]] = relationship(secondary=post_image, viewonly=True)

    publisher: Mapped[User | None] = relationship(foreign_keys=[published_by], back_populates="published_posts")
    updater: Mapped[User | None] = relationship(foreign_keys=[updated_by], back_populates="updated_posts")
    deleter: Mapped[User | None] = relationship(foreign_keys=[deleted_by], back_populates="deleted_posts")

    def get_post_id(self) -> UUID:
        return self.post_id
