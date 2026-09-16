from sqlalchemy import Integer, String, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from datetime import datetime
import enum

from .post_tag import post_tags
from .post_image import post_image, post_thumbnail
from ..database import db

class Status(enum.StrEnum):
    RASCUNHO = "Rascunho"
    PUBLICADO = "Publicado"
    OCULTO = "Oculto"
    APAGADO = "Apagado"

class Post(db.Model):
    __tablename__ = "posts"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    created_by_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)

    title: Mapped[str] = mapped_column(unique=False)
    subtitle: Mapped[str] = mapped_column(unique=False)
    content: Mapped[str] = mapped_column(unique=False)
    slug: Mapped[str] = mapped_column(unique=False)

    is_fixed: Mapped[bool] = mapped_column(unique=False)

    status: Mapped[Status] = mapped_column(
        Enum(Status, values_callable=lambda obj: [item.value for item in obj]), unique=False
    )

    created_at: Mapped[datetime] = mapped_column(unique=False, nullable=False, default=datetime.now)
    updated_at: Mapped[datetime] = mapped_column(unique=False, nullable=True)
    updated_by: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=True)

    tags: Mapped[list["Tag"]] = relationship(
        secondary=post_tags,
        back_populates="posts",
    )

    images: Mapped[list["Image"]] = relationship(
        secondary=post_image,
        back_populates="posts",
    )
    
    thumbnail: Mapped("Image") = relationship(
        secondary=post_thumbnail,
        back_populates="thumbnail_posts"
    )