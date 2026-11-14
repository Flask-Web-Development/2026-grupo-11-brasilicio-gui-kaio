from sqlalchemy import select

from uuid import UUID

from ..database import db
from ..models.ombudsman_message import OmbudsmanMessage
from ..models.ombudsman_question import OmbudsmanQuestion
from ..schemas.ombudsman_message import OmbudsmanMessageCreate, OmbudsmanMessageUpdate
from ..schemas.ombudsman_question import OmbudsmanQuestionCreate, OmbudsmanQuestionUpdate

# def list_tags() -> list[Tag]:
#     return list(db.session.scalars(select(Tag)).all())

def get_message(id: UUID) -> OmbudsmanMessage:
    return db.session.get(OmbudsmanMessage, id)

def create_message(data: OmbudsmanMessageCreate) -> OmbudsmanMessage:
    message = OmbudsmanMessage(**data.model_dump())

    db.session.add(message)
    db.session.commit()

    return message

def remove_message(message: OmbudsmanMessage) -> None:
    db.session.delete(message)
    db.session.commit()
    return None

def update_message(message: OmbudsmanMessage, data: OmbudsmanMessageUpdate) -> OmbudsmanMessage:
    values = data.model_dump(exclude_unset=True)

    if "content" in values:
        message.content = values["content"]
    
    db.session.commit()

    return message

def get_question(id: UUID) -> OmbudsmanQuestion:
    return db.session.get(OmbudsmanQuestion, id)

def create_question(data: OmbudsmanQuestionCreate) -> OmbudsmanQuestion:
    question = OmbudsmanQuestion(**data.model_dump())

    db.session.add(question)
    db.session.commit()

    return question

def remove_question(question: OmbudsmanQuestion) -> None:
    db.session.delete(question)
    db.session.commit()
    return None

def update_question(question: OmbudsmanQuestion, data: OmbudsmanQuestionUpdate) -> OmbudsmanQuestion:
    values = data.model_dump(exclude_unset=True)

    if "title" in values:
        question.title = values["title"]
    if "content" in values:
        question.content = values["content"]
    if "type" in values:
        question.type = values["type"]
    

    db.session.commit()

    return question

# def get_tag(id: int) -> Tag | None:
#     return db.session.get(Tag, id)

# def create_tag(data: TagCreate) -> Tag:
#     tag = Tag(**data.model_dump())

#     db.session.add(tag)
#     db.session.commit()
#     return tag

# def remove_tag(tag: Tag) -> None:
#     db.session.delete(tag)
#     db.session.commit()
#     return None

# def update_tag(tag: Tag, data: TagUpdate) -> Tag:
#     values = data.model_dump(exclude_unset=True)

#     if "name" in values:
#         tag.name = values["name"]
#     if "importance" in values:
#         tag.importance = values["importance"]

#     db.session.commit()

#     return tag
