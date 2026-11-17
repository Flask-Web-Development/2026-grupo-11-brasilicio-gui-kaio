from uuid import UUID

from sqlalchemy import select

from ..database import db, utc_now
from ..models.ombudsman_message import OmbudsmanMessage
from ..models.ombudsman_question import OmbudsmanQuestion, Status
from ..models.user import Role
from ..schemas.ombudsman_message import OmbudsmanMessageCreate, OmbudsmanMessageUpdate
from ..schemas.ombudsman_question import OmbudsmanQuestionCreate, OmbudsmanQuestionUpdate

def list_questions(user_id: str | None = None, include_deleted: bool = False) -> list[OmbudsmanQuestion]:
    statement = select(OmbudsmanQuestion)
    if not include_deleted:
        statement = statement.where(OmbudsmanQuestion.deleted_at.is_(None))
    if user_id is not None:
        statement = statement.where(OmbudsmanQuestion.user_id == user_id)
    return list(db.session.scalars(statement).all())

def list_messages(question_id: UUID, include_deleted: bool = False) -> list[OmbudsmanMessage]:
    statement = select(OmbudsmanMessage).where(OmbudsmanMessage.ombudsman_question_id == question_id)
    if not include_deleted:
        statement = statement.where(OmbudsmanMessage.deleted_at.is_(None))
    return list(db.session.scalars(statement).all())

def get_message(message_id: UUID) -> OmbudsmanMessage | None:
    return db.session.get(OmbudsmanMessage, message_id)

def create_message(data: OmbudsmanMessageCreate, question_id: UUID, user_id: str, role: Role) -> OmbudsmanMessage:
    question = db.session.get(OmbudsmanQuestion, question_id)
    if question is None or question.deleted_at is not None:
        raise ValueError("Question not found")

    message = OmbudsmanMessage(
        ombudsman_question_id=question_id,
        user_id=user_id,
        **data.model_dump(),
    )
    question.status = Status.RESPONDIDO if role == Role.ADMIN else Status.PENDENTE
    db.session.add(message)
    db.session.commit()
    return message

def remove_message(message: OmbudsmanMessage) -> None:
    message.deleted_at = utc_now()
    db.session.commit()
    return None

def update_message(message: OmbudsmanMessage, data: OmbudsmanMessageUpdate) -> OmbudsmanMessage:
    values = data.model_dump(exclude_unset=True)

    if "content" in values:
        message.content = values["content"]

    db.session.commit()

    return message

def get_question(question_id: UUID) -> OmbudsmanQuestion | None:
    return db.session.get(OmbudsmanQuestion, question_id)

def create_question(data: OmbudsmanQuestionCreate, user_id: str) -> OmbudsmanQuestion:
    question = OmbudsmanQuestion(**data.model_dump(), user_id=user_id)

    db.session.add(question)
    db.session.commit()

    return question

def hide_question(question: OmbudsmanQuestion) -> None:
    question.status = Status.FECHADO
    question.deleted_at = utc_now()
    db.session.commit()
    return None

def update_question(question: OmbudsmanQuestion, data: OmbudsmanQuestionUpdate) -> OmbudsmanQuestion:
    values = data.model_dump(exclude_unset=True)

    for field in ("title", "content", "type"):
        if field in values and values[field] is None:
            raise ValueError(f"{field} cannot be null")

    if "title" in values:
        question.title = values["title"]
    if "content" in values:
        question.content = values["content"]
    if "type" in values:
        question.type = values["type"]

    db.session.commit()

    return question

def close_question(question: OmbudsmanQuestion) -> None:
    question.status = Status.FECHADO
    db.session.commit()
    return None