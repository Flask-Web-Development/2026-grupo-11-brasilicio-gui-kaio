from sqlalchemy import select
from uuid import UUID
from sqlalchemy.exc import IntegrityError

from ..database import db
from ..models.tag import Tag
from ..schemas.tag import TagCreate, TagUpdate

def list_tags() -> list[Tag]:
    return list(db.session.scalars(select(Tag).order_by(Tag.name)).all())

def get_tag(tag_id: UUID) -> Tag | None:
    return db.session.get(Tag, tag_id)

def create_tag(data: TagCreate) -> Tag:
    tag = Tag(**data.model_dump())

    db.session.add(tag)
    try:
        db.session.commit()
    except IntegrityError as error:
        db.session.rollback()
        raise ValueError("A tag with this name already exists") from error
    return tag

def remove_tag(tag: Tag) -> None:
    db.session.delete(tag)
    db.session.commit()
    return None

def update_tag(tag: Tag, data: TagUpdate) -> Tag:
    values = data.model_dump(exclude_unset=True)

    if "name" in values and values["name"] is None:
        raise ValueError("name cannot be null")
    if "name" in values:
        tag.name = values["name"]

    try:
        db.session.commit()
    except IntegrityError as error:
        db.session.rollback()
        raise ValueError("A tag with this name already exists") from error

    return tag
