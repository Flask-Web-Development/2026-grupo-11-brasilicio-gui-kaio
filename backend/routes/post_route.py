from flask import Blueprint, jsonify, request
from flask_jwt_extended import current_user
from pydantic import ValidationError

from uuid import UUID

from ..schemas.post import (
    PostCreate,
    PostDashboardResponse,
    PostPageResponse,
    PostPublicResponse,
    PostResponse,
    PostUpdate,
)
from ..services.post_service import (
    list_posts,
    get_post,
    create_post,
    restore_post,
    update_post,
    soft_delete_post,
    get_post_dashboard,
    get_public_post_by_slug,
    get_public_posts,
    list_deleted_posts
)

from ..models.post import Status
from ..auth import admin_required

route_post = Blueprint("posts", __name__, url_prefix="/posts")

def object_post_serialize(post):
    return PostResponse.model_validate(post).model_dump(mode="json")

@route_post.get("")
@admin_required
def get_posts():
    return jsonify([object_post_serialize(post) for post in list_posts()]), 200

def object_public_post_serialize(post):
    return PostPublicResponse.model_validate(post).model_dump(mode="json")

@route_post.get("/public")
def get_public_post_list():
    try:
        page = int(request.args.get("page", "1"))
        per_page = int(request.args.get("per_page", "20"))
    except ValueError:
        return jsonify({"error": "page and per_page must be integers"}), 400
    if page < 1 or per_page < 1 or per_page > 100:
        return jsonify({"error": "page must be positive and per_page must be between 1 and 100"}), 400

    tag_id = None
    raw_tag_id = request.args.get("tag_id")
    if raw_tag_id:
        try:
            tag_id = UUID(raw_tag_id)
        except ValueError:
            return jsonify({"error": "tag_id must be a UUID"}), 400

    query = request.args.get("q", "").strip() or None
    posts, total = get_public_posts(page, per_page, query, tag_id)
    response = PostPageResponse(
        items=[PostPublicResponse.model_validate(post) for post in posts],
        page=page,
        per_page=per_page,
        total=total,
        has_next=page * per_page < total,
    )
    return jsonify(response.model_dump(mode="json")), 200

@route_post.get("/public/<string:slug>")
def get_public_post_by_slug_route(slug: str):
    post = get_public_post_by_slug(slug)
    if post is None:
        return jsonify({"error": "Post not found"}), 404
    return jsonify(object_public_post_serialize(post)), 200

@route_post.get("/dashboard")
@admin_required
def get_post_dashboard_route():
    response = PostDashboardResponse.model_validate(get_post_dashboard())
    return jsonify(response.model_dump(mode="json")), 200

@route_post.get("/trash")
@admin_required
def get_deleted_posts():
    return jsonify([object_post_serialize(post) for post in list_deleted_posts()]), 200

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
        return jsonify({"errors": error.errors(include_context=False)}), 400

    if current_user.user_id is None and post_data.status == Status.PUBLICADO:
        return jsonify({"error": "Publishing requires a persisted SUAP user"}), 403
    try:
        post = create_post(post_data, current_user.user_id)
    except ValueError as error:
        return jsonify({"error": str(error)}), 400
    return jsonify(object_post_serialize(post)), 201

@route_post.delete("/<uuid:post_id>")
@admin_required
def delete_post(post_id: UUID):
    post = get_post(post_id)
    if post is None:
        return jsonify({"error": "Post not found"}), 404
    try:
        soft_delete_post(post, current_user.user_id)
    except ValueError as error:
        return jsonify({"error": str(error)}), 409
    return "", 204

@route_post.post("/<uuid:post_id>/restore")
@admin_required
def restore_deleted_post(post_id: UUID):
    post = get_post(post_id)
    if post is None:
        return jsonify({"error": "Post not found"}), 404
    try:
        post = restore_post(post, current_user.user_id)
    except ValueError as error:
        return jsonify({"error": str(error)}), 409
    return jsonify(object_post_serialize(post)), 200

@route_post.put("/<uuid:post_id>")
@admin_required
def put_post(post_id: UUID):
    try:
        put_body = request.get_json()
        post_data = PostUpdate.model_validate(put_body)
    except ValidationError as error:
        return jsonify({"errors": error.errors(include_context=False)}), 400

    post = get_post(post_id)
    if post is None:
        return jsonify({"error": "Post not found"}), 404
    if current_user.user_id is None and "status" in post_data.model_fields_set and post_data.status == Status.PUBLICADO:
        return jsonify({"error": "Publishing requires a persisted SUAP user"}), 403

    try:
        post = update_post(post, post_data, current_user.user_id)
    except ValueError as error:
        return jsonify({"error": str(error)}), 400
    return jsonify(object_post_serialize(post)), 200
