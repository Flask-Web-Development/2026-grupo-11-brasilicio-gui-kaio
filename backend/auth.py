from functools import wraps

from flask_jwt_extended import current_user

from .models.user import Role

def admin_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if current_user.role != Role.ADMIN:
            return "", 403
        
        return func(*args, **kwargs)
    
    return wrapper

def is_authorized(id: UUID):
    return current_user.id == id or current_user.role == Role.ADMIN