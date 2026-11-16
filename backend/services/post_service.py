from uuid import UUID

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from ..database import db
from ..models.image import Image
from ..models.post import Post
from ..models.post_image import PostImage
from ..models.tag import Tag
from ..schemas.post_image import PostImageCreate
from ..schemas.post import PostCreate, PostUpdate


def list_posts() -> list[Post]:
    return list(db.session.scalars(select(Post)).all())


def get_post(post_id: UUID) -> Post | None:
    return db.session.get(Post, post_id)


def get_tags(tag_ids: list[UUID]) -> list[Tag]:
    tags = list(db.session.scalars(select(Tag).where(Tag.tag_id.in_(tag_ids))).all())
    if len(tags) != len(set(tag_ids)):
        raise ValueError("One or more tags were not found")
    return tags


def get_post_images(image_data: list[PostImageCreate]) -> list[PostImage]:
    image_ids = {image.image_id for image in image_data}
    existing_ids = set(
        db.session.scalars(select(Image.image_id).where(Image.image_id.in_(image_ids)))
    )
    if image_ids != existing_ids:
        raise ValueError("One or more images were not found")
    return [PostImage(**image.model_dump()) for image in image_data]


def create_post(data: PostCreate) -> Post:
    tags = get_tags(data.tags)
    post_images = get_post_images(data.images)
    post = Post(**data.model_dump(exclude={"tags", "images"}))
    post.tags = tags
    post.post_images = post_images

    db.session.add(post)
    try:
        db.session.commit()
    except IntegrityError as error:
        db.session.rollback()
        raise ValueError("Post violates a database constraint") from error
    return post


def remove_post(post: Post) -> None:
    db.session.delete(post)
    db.session.commit()


def update_post(post: Post, data: PostUpdate) -> Post:
    values = data.model_dump(exclude_unset=True)

    for field in ("slug", "title", "content", "is_fixed"):
        if field in values:
            if values[field] is None:
                raise ValueError(f"{field} cannot be null")
            setattr(post, field, values[field])

    if "subtitle" in values:
        post.subtitle = values["subtitle"]
    if "tags" in values and values["tags"] is not None:
        post.tags = get_tags(values["tags"])
    if "images" in values and data.images is not None:
        post.post_images = get_post_images(data.images)

    try:
        db.session.commit()
    except IntegrityError as error:
        db.session.rollback()
        raise ValueError("Post violates a database constraint") from error
    return post
