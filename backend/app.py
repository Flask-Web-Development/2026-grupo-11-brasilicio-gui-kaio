import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token
from pydantic import ValidationError

from .database import db
from .models.user import User
from .schemas.login import LoginRequest
from .services.user_service import authenticate_suap_user

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

jwt = JWTManager()

@jwt.user_identity_loader
def user_identity_lookup(user: User):
    return str(user.get_user_id())

@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return User.query.filter_by(id=identity).one_or_none()

def login():
    try:
        login_request = LoginRequest.model_validate(request.get_json(silent=True))
        user = authenticate_suap_user(
            login_request.username,
            login_request.password.get_secret_value(),
        )
    except (ValueError, ValidationError):
        return jsonify({"error": "Wrong username or password"}), 401

    access_token = create_access_token(
        identity=user,
        additional_claims={"role": str(user.role)},
    )
    return jsonify(access_token=access_token)

def create_app(test_config=None):
    application = Flask(__name__, instance_relative_config=True)
    cors_origins = [
        origin.strip()
        for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
        if origin.strip()
    ]
    CORS(application, origins=cors_origins)

    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        database_url = (
            "sqlite:////tmp/ifpar.db"
            if os.getenv("VERCEL")
            else "sqlite:///db.sqlite"
        )
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql+psycopg://", 1)
    elif database_url.startswith("postgresql://"):
        database_url = database_url.replace(
            "postgresql://", "postgresql+psycopg://", 1
        )

    secret_key = os.getenv("SECRET_KEY", "dev")
    jwt_secret_key = os.getenv("JWT_SECRET_KEY", "super-secret")
    if os.getenv("VERCEL") and (
        len(secret_key) < 32 or len(jwt_secret_key) < 32
    ):
        raise RuntimeError(
            "SECRET_KEY and JWT_SECRET_KEY must contain at least 32 characters"
        )

    application.config.from_mapping(
        SECRET_KEY=secret_key,
        JWT_SECRET_KEY=jwt_secret_key,
        SQLALCHEMY_DATABASE_URI=database_url,
    )
    if test_config:
        application.config.from_mapping(test_config)
    else:
        application.config.from_pyfile("config.py", silent=True)

    db.init_app(application)
    jwt.init_app(application)
    application.add_url_rule("/login", view_func=login, methods=["POST"])

    from .routes.post_route import route_post
    from .routes.tag_route import route_tag
    from .routes.user_route import route_user
    from .routes.image_route import route_image
    from .routes.ombudsman_route import route_ombudsman

    application.register_blueprint(route_user)
    application.register_blueprint(route_tag)
    application.register_blueprint(route_post)
    application.register_blueprint(route_image)
    application.register_blueprint(route_ombudsman)

    from .models.image import Image
    from .models.post import Post
    from .models.post_image import post_image
    from .models.post_tag import post_tags
    from .models.tag import Tag
    from .models.user import User
    from .models.ombudsman_question import OmbudsmanQuestion
    from .models.ombudsman_message import OmbudsmanMessage

    with application.app_context():
        db.create_all()

    return application

app = create_app()
