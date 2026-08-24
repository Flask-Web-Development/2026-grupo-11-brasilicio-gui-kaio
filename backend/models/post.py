from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .post_tag import post_tags
from ..database import db

class Post(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(unique=False)
    content: Mapped[str] = mapped_column(unique=False)

    tags: Mapped[list["Tag"]] = relationship(
        secondary=post_tags,
        back_populates="posts",
    )