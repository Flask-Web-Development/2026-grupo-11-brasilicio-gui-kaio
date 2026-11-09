from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, current_user
from pydantic import ValidationError

from ..schemas.image import (
    ImageCreate,
    ImageResponse,
)
# from ..services.image_service import (
#     ...
# )

from ..auth import is_authorized, admin_required, suap_sync_required

route_image = Blueprint("images", __name__, url_prefix="/images")
