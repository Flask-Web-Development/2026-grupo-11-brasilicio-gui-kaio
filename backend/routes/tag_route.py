from flask import Blueprint, jsonify, request
from pydantic import ValidationError
from uuid import UUID

from ..schemas.tag import TagCreate, TagResponse, TagUpdate
from ..services.tag_service import (
    list_tags,
    get_tag,
    create_tag,
    remove_tag,
    update_tag
)

from ..auth import admin_required

route_tag = Blueprint("tags", __name__, url_prefix="/tags")

def object_tag_serialize(tag):
    return TagResponse.model_validate(tag).model_dump()

@route_tag.get("")
def get_tags():
    return jsonify([object_tag_serialize(tag) for tag in list_tags()]), 200

@route_tag.get("/<uuid:tag_id>")
def get_tag_by_id(tag_id: UUID):
    tag = get_tag(tag_id)
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
        return jsonify({"errors": error.errors(include_context=False)}), 400

    try:
        tag = create_tag(tag_data)
    except ValueError as error:
        return jsonify({"error": str(error)}), 409
    return jsonify(object_tag_serialize(tag)), 201

@route_tag.delete("/<uuid:tag_id>")
@admin_required
def delete_tag(tag_id: UUID):
    tag = get_tag(tag_id)
    if tag is None:
        return jsonify({"error": "Tag not found"}), 404
    remove_tag(tag)
    return "", 204

@route_tag.put("/<uuid:tag_id>")
@admin_required
def put_tag(tag_id: UUID):
    try:
        put_body = request.get_json()
        tag_data = TagUpdate.model_validate(put_body)
    except ValidationError as error:
        return jsonify({"errors": error.errors(include_context=False)}), 400

    tag = get_tag(tag_id)
    if tag is None:
        return jsonify({"error": "Tag not found"}), 404

    try:
        tag = update_tag(tag, tag_data)
    except ValueError as error:
        return jsonify({"error": str(error)}), 409
    return jsonify(object_tag_serialize(tag)), 200
