from sqlalchemy import select

from ..database import db
from ..models.tag import Tag
from ..schemas.tag import TagCreate, TagUpdate

def list_tags() -> list[Tag]:
    return list(db.session.scalars(select(Tag)).all())

def get_tag(id: int) -> Tag | None:
    return db.session.get(Tag, id)

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

    if "name" in values:
        tag.name = values["name"]
    if "importance" in values:
        tag.importance = values["importance"]

    db.session.commit()

    return tag
