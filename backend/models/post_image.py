from sqlalchemy import String, Table, Column, ForeignKey, Integer

from ..database import db

post_thumbnail = Table(
    "post_thumbnail",
    db.Model.metadata,
    Column("post_id", ForeignKey("posts.id"), primary_key=True),
    Column("image_id", ForeignKey("images.id"), primary_key=True),
)

post_image = Table(
    "post_image",
    db.Model.metadata,
    Column("post_id", ForeignKey("posts.id"), primary_key=True),
    Column("image_id", ForeignKey("images.id"), primary_key=True),
    Column("alt_text", String),
    Column("width", Integer), # in px
    Column("height", Integer)
)