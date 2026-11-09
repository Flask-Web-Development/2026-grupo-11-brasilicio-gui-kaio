from sqlalchemy import Text, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from uuid import UUID, uuid4

from ..database import db
from .post_image import PostImage

class Image(db.Model):
    __tablename__ = "Image"

    image_id: Mapped[UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid4, nullable=False)
    path: Mapped[str] = mapped_column(Text, unique=True, nullable=False)

    # FK com post
    post_images: Mapped[list["PostImage"]] = relationship(back_populates="image")

    def get_image_id(self) -> UUID:
        return self.image_id
