from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

from .models.user import User

app = Flask(__name__, instance_relative_config=True)

jwt = JWTManager(app)

@app.get("/hello")
def hello():
  return "Hello World"

@jwt.user_identity_loader
def user_identity_lookup(user: User):
    return user.get_user_id()

@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return User.query.filter_by(id=identity).one_or_none()

@app.route("/login", methods=["POST"])
def login():
  #TODO: convert to pydantic object
  username = request.json.get("username", None)
  password = request.json.get("password", None)

  user: User = User.query.filter_by(username=username).one_or_none()

  if not user or not user.check_password(password):
    return jsonify("Wrong username or password"), 401

  additional_claims = {
    "role": str(user.role)
  }

  access_token = create_access_token(identity=user, additional_claims=additional_claims)
  return jsonify(access_token=access_token)