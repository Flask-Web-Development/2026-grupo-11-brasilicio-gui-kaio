from sqlalchemy import Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .post_image import post_image, post_thumbnail
from ..database import db

class Image(db.Model):
    __tablename__ = "images"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    path: Mapped[str] = mapped_column(nullable=False)

    posts: Mapped[list["Post"]] = relationship(
        secondary=post_image,
        back_populates="images",
    )

    thumbnail_post: Mapped[list["Post"]] = relationship(
        secondary=post_thumbnail,
        back_populates="thumbnail"
    )