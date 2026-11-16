from uuid import UUID

from flask import Blueprint, jsonify, request
from flask_jwt_extended import current_user, jwt_required
from pydantic import ValidationError

from ..models.user import Role
from ..schemas.ombudsman_message import (
    OmbudsmanMessageCreate,
    OmbudsmanMessageResponse,
    OmbudsmanMessageUpdate,
)
from ..schemas.ombudsman_question import (
    OmbudsmanQuestionCreate,
    OmbudsmanQuestionResponse,
    OmbudsmanQuestionUpdate,
)
from ..services.ombudsman_service import (
    create_message,
    create_question,
    get_message,
    get_question,
    list_messages,
    list_questions,
    remove_message,
    remove_question,
    update_message,
    update_question,
)

route_ombudsman = Blueprint("ombudsman", __name__, url_prefix="/ombudsman")

def is_admin() -> bool:
    return current_user.role == Role.ADMIN

def can_access_question(question) -> bool:
    return is_admin() or question.user_id == current_user.user_id

def object_question_serialize(question):
    return OmbudsmanQuestionResponse.model_validate(question).model_dump(mode="json")

def object_message_serialize(message):
    return OmbudsmanMessageResponse.model_validate(message).model_dump(mode="json")

@route_ombudsman.get("/question")
@route_ombudsman.get("/questions")
@jwt_required()
def get_questions():
    questions = list_questions(None if is_admin() else current_user.user_id)
    return jsonify([object_question_serialize(question) for question in questions]), 200

@route_ombudsman.post("/question")
@route_ombudsman.post("/questions")
@jwt_required()
def post_question():
    try:
        question_data = OmbudsmanQuestionCreate.model_validate(
            request.get_json(silent=True)
        )
    except ValidationError as error:
        return jsonify({"errors": error.errors(include_context=False)}), 400

    question = create_question(question_data, current_user.user_id)
    return jsonify(object_question_serialize(question)), 201

@route_ombudsman.get("/question/<uuid:question_id>")
@route_ombudsman.get("/questions/<uuid:question_id>")
@jwt_required()
def get_question_by_id(question_id: UUID):
    question = get_question(question_id)
    if question is None or question.deleted_at is not None:
        return jsonify({"error": "Question not found"}), 404
    if not can_access_question(question):
        return "", 403
    return jsonify(object_question_serialize(question)), 200

@route_ombudsman.put("/question/<uuid:question_id>")
@route_ombudsman.put("/questions/<uuid:question_id>")
@jwt_required()
def put_question(question_id: UUID):
    try:
        question_data = OmbudsmanQuestionUpdate.model_validate(
            request.get_json(silent=True)
        )
    except ValidationError as error:
        return jsonify({"errors": error.errors(include_context=False)}), 400

    question = get_question(question_id)
    if question is None or question.deleted_at is not None:
        return jsonify({"error": "Question not found"}), 404
    if not can_access_question(question):
        return "", 403
    question = update_question(question, question_data)
    return jsonify(object_question_serialize(question)), 200

@route_ombudsman.delete("/question/<uuid:question_id>")
@route_ombudsman.delete("/questions/<uuid:question_id>")
@jwt_required()
def delete_question(question_id: UUID):
    question = get_question(question_id)
    if question is None or question.deleted_at is not None:
        return jsonify({"error": "Question not found"}), 404
    if not can_access_question(question):
        return "", 403
    remove_question(question)
    return "", 204

@route_ombudsman.get("/question/<uuid:question_id>/message")
@route_ombudsman.get("/questions/<uuid:question_id>/messages")
@jwt_required()
def get_question_messages(question_id: UUID):
    question = get_question(question_id)
    if question is None or question.deleted_at is not None:
        return jsonify({"error": "Question not found"}), 404
    if not can_access_question(question):
        return "", 403
    return jsonify(
        [object_message_serialize(message) for message in list_messages(question_id)]
    ), 200

@route_ombudsman.post("/question/<uuid:question_id>/message")
@route_ombudsman.post("/questions/<uuid:question_id>/messages")
@jwt_required()
def post_question_message(question_id: UUID):
    try:
        message_data = OmbudsmanMessageCreate.model_validate(
            request.get_json(silent=True)
        )
    except ValidationError as error:
        return jsonify({"errors": error.errors(include_context=False)}), 400

    question = get_question(question_id)
    if question is None or question.deleted_at is not None:
        return jsonify({"error": "Question not found"}), 404
    if not can_access_question(question):
        return "", 403
    message = create_message(
        message_data, question.ombudsman_question_id, current_user.user_id
    )
    return jsonify(object_message_serialize(message)), 201

@route_ombudsman.get("/message/<uuid:message_id>")
@route_ombudsman.get("/messages/<uuid:message_id>")
@jwt_required()
def get_message_by_id(message_id: UUID):
    message = get_message(message_id)
    if message is None or message.deleted_at is not None:
        return jsonify({"error": "Message not found"}), 404
    question = get_question(message.ombudsman_question_id)
    if question is None or question.deleted_at is not None:
        return jsonify({"error": "Message not found"}), 404
    if not can_access_question(question):
        return "", 403
    return jsonify(object_message_serialize(message)), 200

@route_ombudsman.put("/message/<uuid:message_id>")
@route_ombudsman.put("/messages/<uuid:message_id>")
@jwt_required()
def put_message(message_id: UUID):
    try:
        message_data = OmbudsmanMessageUpdate.model_validate(
            request.get_json(silent=True)
        )
    except ValidationError as error:
        return jsonify({"errors": error.errors(include_context=False)}), 400

    message = get_message(message_id)
    if message is None or message.deleted_at is not None:
        return jsonify({"error": "Message not found"}), 404
    question = get_question(message.ombudsman_question_id)
    if question is None or question.deleted_at is not None:
        return jsonify({"error": "Message not found"}), 404
    if not can_access_question(question) or (
        not is_admin() and message.user_id != current_user.user_id
    ):
        return "", 403
    message = update_message(message, message_data)
    return jsonify(object_message_serialize(message)), 200

@route_ombudsman.delete("/message/<uuid:message_id>")
@route_ombudsman.delete("/messages/<uuid:message_id>")
@jwt_required()
def delete_message(message_id: UUID):
    message = get_message(message_id)
    if message is None or message.deleted_at is not None:
        return jsonify({"error": "Message not found"}), 404
    question = get_question(message.ombudsman_question_id)
    if question is None or question.deleted_at is not None:
        return jsonify({"error": "Message not found"}), 404
    if not can_access_question(question) or (
        not is_admin() and message.user_id != current_user.user_id
    ):
        return "", 403
    remove_message(message)
    return "", 204
