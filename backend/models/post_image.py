from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import String, ForeignKey, Integer, Enum, Index, text, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

import enum

from uuid import UUID, uuid4

from ..database import db

if TYPE_CHECKING:
    from .image import Image
    from .post import Post

class UsageType(enum.StrEnum):
    THUMBNAIL = "THUMBNAIL"
    CONTENT = "CONTENT"

class PostImage(db.Model):
    __tablename__ = "Mapping_Post_Image"
    __table_args__ = (
        Index("mapping_post_image_one_thumbnail", "post_id", unique=True, postgresql_where=text("usage_type = 'THUMBNAIL'"), sqlite_where=text("usage_type = 'THUMBNAIL'")),
    )

    post_image_id: Mapped[UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid4, nullable=False)
    post_id: Mapped[UUID] = mapped_column(Uuid(as_uuid=True), ForeignKey("Post.post_id", ondelete="CASCADE"), nullable=False)
    image_id: Mapped[UUID | None] = mapped_column(Uuid(as_uuid=True), ForeignKey("Image.image_id", ondelete="SET NULL"), nullable=True)
    usage_type: Mapped[UsageType] = mapped_column(Enum(UsageType, values_callable=lambda obj: [item.value for item in obj], native_enum=False, create_constraint=True), default=UsageType.CONTENT, nullable=False)
    position: Mapped[int | None] = mapped_column(Integer, nullable=True)
    width: Mapped[int | None] = mapped_column(Integer, nullable=True)
    height: Mapped[int | None] = mapped_column(Integer, nullable=True)
    alt: Mapped[str | None] = mapped_column(String, nullable=True)

    post: Mapped[Post] = relationship(back_populates="post_images")
    image: Mapped[Image | None] = relationship(back_populates="post_images")

post_image = PostImage.__table__
post_thumbnail = post_image
