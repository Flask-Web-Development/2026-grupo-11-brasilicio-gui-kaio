from sqlalchemy import Integer, String, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from uuid import UUID, uuid4

from .post_image import post_image
from ..database import db


class Image(db.Model):
    __tablename__ = "images"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    path: Mapped[str] = mapped_column(nullable=False)

    posts: Mapped[list["Post"]] = relationship(
        secondary=post_image,
        back_populates="image",
    )

# add some sthuf to get the image data later here