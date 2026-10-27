from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from pydantic import ValidationError

from ..schemas.tag import TagCreate, TagResponse, TagUpdate
from ..services.tag_service import (
    list_tags,
    get_tag,
    create_tag,
    remove_tag,
    update_tag
)

from ..auth import is_authorized, admin_required

route_tag = Blueprint("tags", __name__, url_prefix="/tags")

def object_tag_serialize(tag):
    return TagResponse.model_validate(tag).model_dump()

@route_tag.get("")
@admin_required
def get_tags():
    return jsonify([object_tag_serialize(tag) for tag in list_tags()]), 200

@route_tag.get("/<int:id>")
@admin_required
def get_tag_by_id(id: int):
    tag = get_tag(id)
    if tag is None:
        return jsonify({"error": "Tag not found"}), 404
    return jsonify(object_tag_serialize(tag)), 200

@route_tag.post("")
@admin_required
def post_tag():
    try:
        post_body = request.get_json()
        tag_data = TagCreate.model_validate(post_body)
    except ValidationError as error:
        return jsonify({"errors": error.errors()}), 400

    tag = create_tag(tag_data)
    return jsonify(object_tag_serialize(tag)), 201

@route_tag.delete("/<int:id>")
@admin_required
def delete_tag(id: int):
    tag = get_tag(id)
    if tag is None:
        return jsonify({"error": "Tag not found"}), 404
    remove_tag(tag)
    return "", 204

@route_tag.put("/<int:id>")
@admin_required
def put_tag(id: int):
    try:
        put_body = request.get_json()
        tag_data = TagUpdate.model_validate(put_body)
    except ValidationError as error:
        return jsonify({"errors": error.errors()}), 400

    tag = get_tag(id)
    if tag is None:
        return jsonify({"error": "Tag not found"}), 404

    tag = update_tag(tag, tag_data)
    return jsonify(object_tag_serialize(tag)), 200