from sqlalchemy import select

from ..database import db
from ..models.post import Post
from ..schemas.post import PostCreate, PostUpdate

def list_posts() -> list[Post]:
    return list(db.session.scalars(select(Post)).all())

def get_post(id: int) -> Post | None:
    return db.session.get(Post, id)

def create_post(data: PostCreate) -> Post:
    post = Post(**data.model_dump())

    db.session.add(post)
    db.session.commit()
    return post

def remove_post(post: Post) -> None:
    db.session.delete(post)
    db.session.commit()
    return None

def update_post(post: Post, data: PostUpdate) -> Post:
    values = data.model_dump(exclude_unset=True)

    if "title" in values:
        post.title = values["title"]
    if "subtitle" in values:
        post.subtitle = values["subtitle"]
    if "content" in values:
        post.content = values["content"]
    if "slug" in values:
        post.slug = values["slug"]

    if "is_fixed" in values:
        post.is_fixed = values["is_fixed"]

    if "status" in values:
        post.status = values["status"]
    if "thumbnail" in values:
        post.thumbnail = values["thumbnail"]
    if "images" in values:
        post.images = values["images"]

    db.session.commit()

    return post

