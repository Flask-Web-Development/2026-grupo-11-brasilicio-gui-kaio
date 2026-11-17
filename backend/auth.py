from functools import wraps
from dataclasses import dataclass
import os
import secrets

from flask import jsonify, request
from flask_jwt_extended import get_current_user, jwt_required

from .models.user import Role

ADMIN_MASTER_SUBJECT = "admin-master"

@dataclass(frozen=True)
class AdminMasterPrincipal:
    user_id: str | None = None
    role: Role = Role.ADMIN

def admin_required(func):
    @wraps(func)
    @jwt_required()
    def wrapper(*args, **kwargs):
        user = get_current_user()
        if user is None or user.role != Role.ADMIN:
            return "", 403
        
        return func(*args, **kwargs)
    
    return wrapper

def suap_sync_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        expected = os.getenv("SUAP_SYNC_SECRET")
        provided = request.headers.get("X-SUAP-Sync-Secret")
        if not expected or not provided or not secrets.compare_digest(provided, expected):
            return jsonify({"error": "Unauthorized"}), 401
        return func(*args, **kwargs)

    return wrapper

def is_authorized(user_id: str):
    user = get_current_user()
    return user is not None and (
        user.user_id == user_id or user.role == Role.ADMIN
    )
