from sqlalchemy import select
from datetime import datetime
from uuid import UUID

from ..database import db
from ..models.ombudsman_message import OmbudsmanMessage
from ..models.ombudsman_question import OmbudsmanQuestion, Status
from ..schemas.ombudsman_message import OmbudsmanMessageCreate, OmbudsmanMessageUpdate
from ..schemas.ombudsman_question import OmbudsmanQuestionCreate, OmbudsmanQuestionUpdate



def list_questions(user_id: str | None = None) -> list[OmbudsmanQuestion]:
    statement = select(OmbudsmanQuestion).where(
        OmbudsmanQuestion.deleted_at.is_(None)
    )
    if user_id is not None:
        statement = statement.where(OmbudsmanQuestion.user_id == user_id)
    return list(db.session.scalars(statement).all())


def list_messages(question_id: UUID) -> list[OmbudsmanMessage]:
    statement = select(OmbudsmanMessage).where(
        OmbudsmanMessage.ombudsman_question_id == question_id,
        OmbudsmanMessage.deleted_at.is_(None),
    )
    return list(db.session.scalars(statement).all())


def get_message(id: UUID) -> OmbudsmanMessage:
    return db.session.get(OmbudsmanMessage, id)


def create_message(
    data: OmbudsmanMessageCreate, question_id: UUID, user_id: str
) -> OmbudsmanMessage:
    message = OmbudsmanMessage(
        ombudsman_question_id=question_id,
        user_id=user_id,
        **data.model_dump(),
    )
    db.session.add(message)
    db.session.commit()
    return message


def remove_message(message: OmbudsmanMessage) -> None:
    message.deleted_at = datetime.now()
    db.session.commit()
    return None


def update_message(
    message: OmbudsmanMessage, data: OmbudsmanMessageUpdate
) -> OmbudsmanMessage:
    values = data.model_dump(exclude_unset=True)

    if "content" in values:
        message.content = values["content"]

    db.session.commit()

    return message


def get_question(id: UUID) -> OmbudsmanQuestion:
    return db.session.get(OmbudsmanQuestion, id)


def create_question(
    data: OmbudsmanQuestionCreate, user_id: str
) -> OmbudsmanQuestion:
    question = OmbudsmanQuestion(**data.model_dump(), user_id=user_id)

    db.session.add(question)
    db.session.commit()

    return question


def remove_question(question: OmbudsmanQuestion) -> None:
    question.status = Status.FECHADO
    question.deleted_at = datetime.now()
    db.session.commit()
    return None


def update_question(question: OmbudsmanQuestion, data: OmbudsmanQuestionUpdate) -> OmbudsmanQuestion:
    values = data.model_dump(exclude_unset=True)

    if "title" in values and values["title"] is not None:
        question.title = values["title"]
    if "content" in values and values["content"] is not None:
        question.content = values["content"]
    if "type" in values and values["type"] is not None:
        question.type = values["type"]

    db.session.commit()

    return question
