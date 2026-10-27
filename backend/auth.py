from functools import wraps
import os
import secrets

from flask import jsonify, request
from flask_jwt_extended import current_user, jwt_required

from .models.user import Role

def admin_required(func):
    @wraps(func)
    @jwt_required()
    def wrapper(*args, **kwargs):
        if current_user.role != Role.ADMIN:
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

def is_authorized(id: int):
    return current_user.id == id or current_user.role == Role.ADMIN