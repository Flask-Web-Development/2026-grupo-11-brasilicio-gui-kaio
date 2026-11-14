from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from pydantic import ValidationError

from ..schemas.user import (
    SuapUserSync,
    UserResponse,
    UserUpdate,
)
from ..services.user_service import (
    get_user,
    list_users,
    sync_suap_user,
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

@route_user.get("/<user_id>")
@jwt_required()
def get_user_by_id(user_id: str):
    if not is_authorized(user_id):
        return "", 403
    user = get_user(user_id)
    if user is None:
        return jsonify({"error": "User not found"}), 404
    return jsonify(object_user_serialize(user)), 200

@route_user.post("/suap")
@suap_sync_required
def post_suap_user():
    try:
        sync_body = request.get_json(silent=True)
        if isinstance(sync_body, dict) and "user_id" not in sync_body:
            sync_body["user_id"] = sync_body.pop("username", None)
        sync_data = SuapUserSync.model_validate(sync_body)
    except ValidationError as error:
        return validation_error_response(error)

    try:
        user = sync_suap_user(sync_data)
    except ValueError as error:
        return jsonify({"error": str(error)}), 409
    return jsonify(object_user_serialize(user)), 200

@route_user.put("/<user_id>")
@jwt_required()
def put_user(user_id: str):
    if not is_authorized(user_id):
        return "", 403
    try:
        put_body = request.get_json(silent=True)
        put_data = UserUpdate.model_validate(put_body)
    except ValidationError as error:
        return validation_error_response(error)

    user = get_user(user_id)
    if user is None:
        return jsonify({"error": "User not found"}), 404

    user = update_user(user, put_data)
    return jsonify(object_user_serialize(user)), 200