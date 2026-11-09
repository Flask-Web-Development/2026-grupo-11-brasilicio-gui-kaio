from sqlalchemy import ForeignKey, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from uuid import UUID

from ..database import db

class PostTag(db.Model):
    __tablename__ = "Mapping_Post_Tag"

    post_id: Mapped[UUID] = mapped_column(Uuid(as_uuid=True), ForeignKey("Post.post_id", ondelete="CASCADE", onupdate="CASCADE"), primary_key=True)
    tag_id: Mapped[UUID] = mapped_column(Uuid(as_uuid=True), ForeignKey("Tag.tag_id", ondelete="CASCADE", onupdate="CASCADE"), primary_key=True)

post_tags = PostTag.__table__
