from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, current_user
from pydantic import ValidationError

from uuid import UUID

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

@route_ombudsman.get("/question/<uuid:question_id>")
@jwt_required
def get_question_by_id(question_id: UUID):
    #todo
    ...