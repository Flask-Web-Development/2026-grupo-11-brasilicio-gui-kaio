import os
from dotenv import load_dotenv

from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token

from .models.user import User
from .schemas.login import LoginRequest

from .database import db

app = Flask(__name__, instance_relative_config=True)

jwt = JWTManager(app)

@app.get("/hello")
def hello():
  return "Hello World"

@jwt.user_identity_loader
def user_identity_lookup(user: User):
    return str(user.get_user_id())

@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return User.query.filter_by(id=identity).one_or_none()

@app.route("/login", methods=["POST"])
def login():
  login_request: LoginRequest = LoginRequest.model_validate(request.json)

  user: User = User.query.filter_by(username=login_request.username).one_or_none()

  if not user or not user.check_password(login_request.password.get_secret_value()):
    return jsonify("Wrong username or password"), 401

  additional_claims = {
    "role": str(user.role)
  }

  access_token = create_access_token(identity=user, additional_claims=additional_claims)
  return jsonify(access_token=access_token)

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

def create_app(test_config=None):
    app.config.from_mapping(
        SECRET_KEY=os.getenv("SECRET_KEY", "dev"),
        JWT_SECRET_KEY=os.getenv("JWT_SECRET_KEY", "super-secret"),
        SQLALCHEMY_DATABASE_URI=os.getenv("DATABASE_URL", "sqlite:///db.sqlite"),
    )

    if test_config:
        app.config.from_mapping(test_config)
    else:
        app.config.from_pyfile("config.py", silent=True)

    db.init_app(app)
    
    # IMPORT ROUTES HERE!!
    from .routes.user_route import route_user
    from .routes.tag_route import route_tag
    from .routes.post_route import route_post

    app.register_blueprint(route_user)
    app.register_blueprint(route_tag)
    app.register_blueprint(route_post)

    # IMPORT MODELS HERE!
    from .models.tag import Tag
    from .models.post_tag import post_tags
    from .models.post_image import post_image
    from .models.image import Image
    from .models.post import Post
    from .models.user import User

    with app.app_context():
        db.create_all()

    return app

def test_user_instance():
    test_app = create_app()

    from .models.user import Role, User

    with test_app.app_context():
        user = User(
            username="usuario_teste_2",
            email="usuario.teste.2@example.com",
            role=Role.USER,
        )
        user.set_password("senha-de-teste-2")

        db.session.add(user)
        db.session.flush()
        db.session.commit()

        loaded_user = db.session.get(User, user.id)

        print(f"Usuário criado: {loaded_user.username}")
        print(f"ID: {loaded_user.id}")
        print(f"Role: {loaded_user.role.value}")
        print(f"Senha válida: {loaded_user.check_password('senha-de-teste')}")
