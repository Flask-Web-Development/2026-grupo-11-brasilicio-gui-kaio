from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, current_user
from pydantic import ValidationError

from uuid import UUID

from ..schemas.user import UserCreate, UserResponse, UserUpdate
from ..services.user_service import (
    list_users,
    get_user,
    create_user,
    remove_user,
    update_user
)

from ..auth import is_authorized, admin_required

route_user = Blueprint("users", __name__, url_prefix="/users")

def object_user_serialize(user):
    return UserResponse.model_validate(user).model_dump()

@route_user.get("")
@admin_required
def get_users():
    return jsonify([object_user_serialize(user) for user in list_users()]), 200

@route_user.get("/<uuid:id>")
@jwt_required()
def get_user_by_id(id: UUID):
    if not is_authorized(id):
        return "", 403
    user = get_user(id)
    if user is None:
        return jsonify({"error": "User not found"}), 404
    return jsonify(object_user_serialize(user)), 200

@route_user.post("")
def post_user():
    try:
        post_body = request.get_json()
        user_data = UserCreate.model_validate(post_body)
    except ValidationError as error:
        return jsonify({"errors": error.errors()}), 400

    user = create_user(user_data)
    return jsonify(object_user_serialize(user)), 201

@route_user.delete("/<uuid:id>")
@jwt_required()
def delete_user(id: UUID):
    if not is_authorized(id):
        return "", 403
    user = get_user(id)
    if user is None:
        return jsonify({"error": "User not found"}), 404
    remove_user(user)
    return "", 204

@route_user.put("/<uuid:id>")
@jwt_required()
def put_user(id: UUID):
    if not is_authorized(id):
        return "", 403
    try:
        put_body = request.get_json()
        put_data = UserUpdate.model_validate(put_body)
    except ValidationError as error:
        return jsonify({"errors": error.errors()}), 400

    user = get_user(id)
    if user is None:
        return jsonify({"error": "User not found"}), 404

    user = update_user(user, put_data)
    return jsonify(object_user_serialize(user)), 200