import os
from flask import Flask

from sqlalchemy import select

from .app import app
from .database import db

def create_app(test_config=None):
    app.config.from_mapping(
        SECRET_KEY="dev",
        JWT_SECRET_KEY = "super-secret",
        SQLALCHEMY_DATABASE_URI="sqlite:///db.sqlite",
    )

    if test_config:
        app.config.from_mapping(test_config)
    else:
        app.config.from_pyfile("config.py", silent=True)

    db.init_app(app)
    
    # IMPORT ROUTES HERE!!
    from .routes.user_route import route_user

    app.register_blueprint(route_user)

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
