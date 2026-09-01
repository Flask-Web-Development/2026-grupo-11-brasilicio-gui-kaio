from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import db

from .post_tag import post_tags

class Tag(db.Model):
    __tablename__ = "tags"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    importance: Mapped[int] = mapped_column(nullable=False)

    posts: Mapped[list["Post"]] = relationship(
        secondary=post_tags,
        back_populates="tags",
    )