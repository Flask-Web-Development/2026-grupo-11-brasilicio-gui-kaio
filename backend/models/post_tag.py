from sqlalchemy import String, Table, Column, ForeignKey

from ..database import db

post_tags = Table(
    "post_tags",
    db.Model.metadata,
    Column("post_id", ForeignKey("posts.id"), primary_key=True),
    Column("tag_id", ForeignKey("tags.id"), primary_key=True),
)