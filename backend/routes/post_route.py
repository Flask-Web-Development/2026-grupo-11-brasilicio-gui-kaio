from flask import Blueprint, jsonify, request
from pydantic import ValidationError

from uuid import UUID

from ..schemas.post import PostCreate, PostResponse, PostUpdate
from ..services.post_service import (
    list_posts,
    get_post,
    create_post,
    remove_post,
    update_post
)

from ..auth import is_authorized, admin_required

route_post = Blueprint("posts", __name__, url_prefix="/posts")

def object_post_serialize(post):
    return PostResponse.model_validate(post).model_dump()

@route_post.get("")
@admin_required
def get_posts():
    return jsonify([object_post_serialize(post) for post in list_posts()]), 200

@route_post.get("/<uuid:post_id>")
@admin_required
def get_post_by_id(post_id: UUID):
    post = get_post(post_id)
    if post is None:
        return jsonify({"error": "Post not found"}), 404
    return jsonify(object_post_serialize(post)), 200

@route_post.post("")
@admin_required
def post_post():
    try:
        post_body = request.get_json()
        post_data = PostCreate.model_validate(post_body)
    except ValidationError as error:
        return jsonify({"errors": error.errors()}), 400

    post = create_post(post_data)
    return jsonify(object_post_serialize(post)), 201

@route_post.delete("/<uuid:post_id>")
@admin_required
def delete_post(post_id: UUID):
    post = get_post(post_id)
    if post is None:
        return jsonify({"error": "Post not found"}), 404
    remove_post(post)
    return "", 204

@route_post.put("/<uuid:post_id>")
@admin_required
def put_post(post_id: UUID):
    try:
        put_body = request.get_json()
        post_data = PostUpdate.model_validate(put_body)
    except ValidationError as error:
        return jsonify({"errors": error.errors()}), 400

    post = get_post(post_id)
    if post is None:
        return jsonify({"error": "Post not found"}), 404

    post = update_post(post, post_data)
    return jsonify(object_post_serialize(post)), 200