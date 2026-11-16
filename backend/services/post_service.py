from uuid import UUID

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from ..database import db, utc_now
from ..models.image import Image
from ..models.post import Post, Status
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


def create_post(data: PostCreate, published_by: str) -> Post:
    tags = get_tags(data.tags)
    post_images = get_post_images(data.images)
    post = Post(**data.model_dump(exclude={"tags", "images"}))
    if post.status == Status.PUBLICADO:
        post.published_at = utc_now()
        post.published_by = published_by
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


def update_post(post: Post, data: PostUpdate, updated_by: str) -> Post:
    values = data.model_dump(exclude_unset=True)

    next_status = values.get("status", post.status)
    next_is_fixed = values.get("is_fixed", post.is_fixed)
    if next_is_fixed and next_status != Status.PUBLICADO:
        raise ValueError("Only published posts can be fixed")

    for field in ("slug", "title", "content", "is_fixed"):
        if field in values:
            if values[field] is None:
                raise ValueError(f"{field} cannot be null")
            setattr(post, field, values[field])

    if "status" in values:
        status_changed = values["status"] != post.status
        if status_changed:
            post.status = values["status"]

        if post.status == Status.PUBLICADO:
            if status_changed or post.published_at is None or post.published_by is None:
                post.published_at = utc_now()
                post.published_by = updated_by
        elif status_changed or post.published_at is not None or post.published_by is not None:
            post.published_at = None
            post.published_by = None

    if "subtitle" in values:
        post.subtitle = values["subtitle"]
    if "tags" in values and values["tags"] is not None:
        post.tags = get_tags(values["tags"])
    if "images" in values and data.images is not None:
        post.post_images = get_post_images(data.images)
    if values:
        post.updated_by = updated_by

    try:
        db.session.commit()
    except IntegrityError as error:
        db.session.rollback()
        raise ValueError("Post violates a database constraint") from error
    return post
