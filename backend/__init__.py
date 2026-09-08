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