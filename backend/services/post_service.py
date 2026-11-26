from uuid import UUID
from datetime import timedelta

from sqlalchemy import select, func, or_
from sqlalchemy.exc import IntegrityError

from ..database import db, utc_now
from ..models.image import Image
from ..models.post import Post, Status
from ..models.post_image import PostImage
from ..models.tag import Tag
from ..schemas.post_image import PostImageCreate
from ..schemas.post import PostCreate, PostUpdate

def get_post(post_id: UUID) -> Post | None:
    return db.session.get(Post, post_id)

def slug_in_use(slug: str, exclude_id: UUID | None = None) -> bool:
    statement = select(Post.post_id).where(Post.slug == slug)
    if exclude_id is not None:
        statement = statement.where(Post.post_id != exclude_id)
    return db.session.scalar(statement) is not None

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

def create_post(data: PostCreate, published_by: str | None) -> Post:
    if data.status == Status.PUBLICADO and published_by is None:
        raise ValueError("Publishing requires a persisted SUAP user")
    if slug_in_use(data.slug):
        raise ValueError("Slug alread in use")
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

def list_posts() -> list[Post]:
    statement = (
        select(Post)
        .where(Post.deleted_at.is_(None))
        .order_by(Post.published_at.desc().nulls_last(), Post.post_id)
    )
    return list(db.session.scalars(statement).all())

def list_deleted_posts() -> list[Post]:
    purge_expired_posts()
    statement = (
        select(Post)
        .where(Post.deleted_at.is_not(None))
        .order_by(Post.published_at.desc())
    )
    return list(db.session.scalars(statement).all())

def get_public_posts(
    page: int,
    per_page: int,
    query: str | None = None,
    tag_id: UUID | None = None,
) -> tuple[list[Post], int]:
    conditions = [
        Post.status == Status.PUBLICADO,
        Post.deleted_at.is_(None),
    ]
    if query:
        pattern = f"%{query}%"
        conditions.append(
            or_(
                Post.slug.ilike(pattern),
                Post.title.ilike(pattern),
                Post.subtitle.ilike(pattern),
                Post.content.ilike(pattern),
            )
        )
    if tag_id is not None:
        conditions.append(Post.tags.any(Tag.tag_id == tag_id))

    total = db.session.scalar(
        select(func.count()).select_from(Post).where(*conditions)
    ) or 0
    statement = (
        select(Post)
        .where(*conditions)
        .order_by(
            Post.is_fixed.desc(),
            Post.published_at.desc().nulls_last(),
            Post.post_id,
        )
        .offset((page - 1) * per_page)
        .limit(per_page)
    )
    return list(db.session.scalars(statement).all()), total

def get_public_post_by_slug(slug: str) -> Post | None:
    statement = select(Post).where(
        Post.slug == slug,
        Post.status == Status.PUBLICADO,
        Post.deleted_at.is_(None),
    )
    return db.session.scalar(statement)

def get_post_dashboard() -> dict[str, object]:
    active = Post.deleted_at.is_(None)
    total = db.session.scalar(
        select(func.count()).select_from(Post).where(active)
    ) or 0
    published = db.session.scalar(
        select(func.count()).select_from(Post).where(
            active, Post.status == Status.PUBLICADO
        )
    ) or 0
    drafts = db.session.scalar(
        select(func.count()).select_from(Post).where(
            active, Post.status == Status.RASCUNHO
        )
    ) or 0
    recent_posts = list(
        db.session.scalars(
            select(Post)
            .where(active, Post.status == Status.PUBLICADO)
            .order_by(Post.published_at.desc().nulls_last(), Post.post_id)
            .limit(5)
        ).all()
    )
    return {
        "total": total,
        "published": published,
        "drafts": drafts,
        "recent_posts": recent_posts,
    }

def purge_expired_posts() -> int:
    cutoff = utc_now() - timedelta(days=60)
    expired_posts = list(
        db.session.scalars(
            select(Post).where(Post.deleted_at <= cutoff)
        ).all()
    )
    if not expired_posts:
        return 0
    for post in expired_posts:
        db.session.delete(post)
    db.session.commit()
    return len(expired_posts)

def soft_delete_post(post: Post, deleted_by: str | None) -> None:
    if post.deleted_at is not None:
        # TODO: if post is already in the trash, we could delete it permanently instead of raising an error
        raise ValueError("Post is already in the trash")
    post.deleted_at = utc_now()
    post.deleted_by = deleted_by
    post.is_fixed = False
    try:
        db.session.commit()
    except IntegrityError as error:
        db.session.rollback()
        raise ValueError("Post violates a database constraint") from error

def restore_post(post: Post, updated_by: str | None) -> Post:
    if post.deleted_at is None:
        raise ValueError("Post is not in the trash")
    post.deleted_at = None
    post.deleted_by = None
    post.status = Status.RASCUNHO
    post.is_fixed = False
    post.updated_by = updated_by
    try:
        db.session.commit()
    except IntegrityError as error:
        db.session.rollback()
        raise ValueError("Post violates a database constraint") from error
    return post

def update_post(post: Post, data: PostUpdate, updated_by: str | None) -> Post:
    if post.deleted_at is not None:
        raise ValueError("Restore the post before editing it")
    values = data.model_dump(exclude_unset=True)

    for field in ("slug", "title", "content", "is_fixed", "status", "tags", "images"):
        if field in values and values[field] is None:
            raise ValueError(f"{field} cannot be null")

    if "slug" in values and slug_in_use(values["slug"], post.post_id):
        raise ValueError("Slug alread in use")

    next_status = values.get("status", post.status)
    next_is_fixed = values.get("is_fixed", post.is_fixed)
    if next_is_fixed and next_status != Status.PUBLICADO:
        raise ValueError("Only published posts can be fixed")

    for field in ("slug", "title", "content", "is_fixed"):
        if field in values:
            setattr(post, field, values[field])

    if "status" in values:
        status_changed = values["status"] != post.status
        if status_changed:
            post.status = values["status"]

        if post.status == Status.PUBLICADO:
            if status_changed or post.published_at is None or post.published_by is None:
                if updated_by is None:
                    raise ValueError("Publishing requires a persisted SUAP user")
                post.published_at = utc_now()
                post.published_by = updated_by
        elif status_changed or post.published_at is not None or post.published_by is not None:
            post.published_at = None
            post.published_by = None

    if "subtitle" in values:
        post.subtitle = values["subtitle"]
    if "tags" in values:
        post.tags = get_tags(values["tags"])
    if "images" in values:
        post.post_images = get_post_images(data.images or [])
    if values:
        post.updated_by = updated_by

    try:
        db.session.commit()
    except IntegrityError as error:
        db.session.rollback()
        raise ValueError("Post violates a database constraint") from error
    return post
