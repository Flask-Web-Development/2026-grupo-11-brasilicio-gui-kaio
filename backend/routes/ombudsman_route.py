from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, current_user
from pydantic import ValidationError

from ..schemas.ombudsman_message import (
    OmbudsmanMessageCreate,
    OmbudsmanMessageResponse,
)
from ..schemas.ombudsman_question import (
    OmbudsmanQuestionCreate,
    OmbudsmanQuestionResponse,
)

# from ..services.ombudsman_service import (
#     ...
# )

from ..auth import is_authorized, suap_sync_required

route_ombudsman = Blueprint("ombudsman", __name__, url_prefix="/ombudsman")
