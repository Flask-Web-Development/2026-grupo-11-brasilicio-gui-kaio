from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, current_user
from pydantic import ValidationError

from ..schemas.user import (
    SuapPasswordUpdate,
    SuapUserSync,
    UserCreate,
    UserResponse,
    UserUpdate,
)
from ..services.user_service import (
    create_user,
    get_user,
    list_users,
    remove_user,
    sync_suap_user,
    set_user_password,
    update_user,
)

from ..auth import is_authorized, admin_required, suap_sync_required

route_user = Blueprint("users", __name__, url_prefix="/users")

def object_user_serialize(user):
    return UserResponse.model_validate(user).model_dump()

def validation_error_response(error: ValidationError):
    return jsonify({"errors": error.errors()}), 400

@route_user.get("")
@admin_required
def get_users():
    return jsonify([object_user_serialize(user) for user in list_users()]), 200

@route_user.get("/<int:id>")
@jwt_required()
def get_user_by_id(id: int):
    if not is_authorized(id):
        return "", 403
    user = get_user(id)
    if user is None:
        return jsonify({"error": "User not found"}), 404
    return jsonify(object_user_serialize(user)), 200

@route_user.post("")
def post_user():
    try:
        post_body = request.get_json(silent=True)
        user_data = UserCreate.model_validate(post_body)
    except ValidationError as error:
        return validation_error_response(error)

    try:
        user = create_user(user_data)
    except ValueError as error:
        return jsonify({"error": str(error)}), 409
    return jsonify(object_user_serialize(user)), 201

@route_user.post("/suap")
@suap_sync_required
def post_suap_user():
    try:
        sync_data = SuapUserSync.model_validate(request.get_json(silent=True))
    except ValidationError as error:
        return validation_error_response(error)

    try:
        user = sync_suap_user(sync_data.username, sync_data.email)
    except ValueError as error:
        return jsonify({"error": str(error)}), 409
    return jsonify(object_user_serialize(user)), 200

@route_user.post("/suap/password")
@suap_sync_required
def post_suap_password():
    try:
        password_data = SuapPasswordUpdate.model_validate(
            request.get_json(silent=True)
        )
    except ValidationError as error:
        return validation_error_response(error)

    user = get_user(password_data.user_id)
    if user is None:
        return jsonify({"error": "User not found"}), 404

    set_user_password(user, password_data.password.get_secret_value())
    return jsonify(object_user_serialize(user)), 200

@route_user.delete("/<int:id>")
@jwt_required()
def delete_user(id: int):
    if not is_authorized(id):
        return "", 403
    user = get_user(id)
    if user is None:
        return jsonify({"error": "User not found"}), 404
    remove_user(user)
    return "", 204

@route_user.put("/<int:id>")
@jwt_required()
def put_user(id: int):
    if not is_authorized(id):
        return "", 403
    try:
        put_body = request.get_json(silent=True)
        put_data = UserUpdate.model_validate(put_body)
    except ValidationError as error:
        return validation_error_response(error)

    user = get_user(id)
    if user is None:
        return jsonify({"error": "User not found"}), 404

    try:
        user = update_user(user, put_data, current_user)
    except PermissionError as error:
        return jsonify({"error": str(error)}), 403
    except ValueError as error:
        return jsonify({"error": str(error)}), 409
    return jsonify(object_user_serialize(user)), 200