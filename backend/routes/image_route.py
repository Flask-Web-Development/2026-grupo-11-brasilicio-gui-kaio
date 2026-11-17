from flask import Blueprint, jsonify, request
from pydantic import ValidationError
from uuid import UUID

from ..schemas.image import ImageCreate, ImageResponse, ImageUpdate
from ..services.image_service import (
    create_image,
    get_image,
    list_images,
    remove_image,
    update_image,
    get_image_post_count
)
from ..auth import admin_required

route_image = Blueprint("images", __name__, url_prefix="/images")

def object_image_serialize(image):
    return ImageResponse.model_validate(image).model_dump(mode="json")

@route_image.get("")
@admin_required
def get_images():
    return jsonify([object_image_serialize(image) for image in list_images()]), 200

@route_image.get("/<uuid:image_id>")
@admin_required
def get_image_by_id(image_id: UUID):
    image = get_image(image_id)
    if image is None:
        return jsonify({"error": "Image not found"}), 404
    return jsonify(object_image_serialize(image)), 200

@route_image.post("")
@admin_required
def post_image():
    try:
        image_data = ImageCreate.model_validate(request.get_json(silent=True))
    except ValidationError as error:
        return jsonify({"errors": error.errors(include_context=False)}), 400

    try:
        image = create_image(image_data)
    except ValueError as error:
        return jsonify({"error": str(error)}), 409
    return jsonify(object_image_serialize(image)), 201

@route_image.put("/<uuid:image_id>")
@admin_required
def put_image(image_id: UUID):
    try:
        image_data = ImageUpdate.model_validate(request.get_json(silent=True))
    except ValidationError as error:
        return jsonify({"errors": error.errors(include_context=False)}), 400

    image = get_image(image_id)
    if image is None:
        return jsonify({"error": "Image not found"}), 404
    try:
        image = update_image(image, image_data)
    except ValueError as error:
        return jsonify({"error": str(error)}), 409
    return jsonify(object_image_serialize(image)), 200

@route_image.delete("/<uuid:image_id>")
@admin_required
def delete_image(image_id: UUID):
    image = get_image(image_id)
    if image is None:
        return jsonify({"error": "Image not found"}), 404
    usage_count = get_image_post_count(image_id)
    if request.args.get("confirm", "").lower() != "true":
        return jsonify({
            "error": "Confirmation required",
            "confirmation_required": True,
            "usage_count": usage_count,
        }), 409
    remove_image(image)
    return "", 204
