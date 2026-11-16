from sqlalchemy import select
from uuid import UUID

from ..database import db
from ..models.tag import Tag
from ..schemas.tag import TagCreate, TagUpdate

def list_tags() -> list[Tag]:
    return list(db.session.scalars(select(Tag)).all())

def get_tag(tag_id: UUID) -> Tag | None:
    return db.session.get(Tag, tag_id)

def create_tag(data: TagCreate) -> Tag:
    tag = Tag(**data.model_dump())

    db.session.add(tag)
    db.session.commit()
    return tag

def remove_tag(tag: Tag) -> None:
    db.session.delete(tag)
    db.session.commit()
    return None

def update_tag(tag: Tag, data: TagUpdate) -> Tag:
    values = data.model_dump(exclude_unset=True)

    if "name" in values and values["name"] is not None:
        tag.name = values["name"]

    db.session.commit()

    return tag
