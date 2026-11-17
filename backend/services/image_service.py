from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from uuid import UUID

from ..database import db
from ..models.image import Image
from ..models.post_image import PostImage
from ..schemas.image import ImageCreate, ImageUpdate

def list_images() -> list[Image]:
    return list(db.session.scalars(select(Image)).all())

def get_image(image_id: UUID) -> Image | None:
    return db.session.get(Image, image_id)

def create_image(data: ImageCreate) -> Image:
    image = Image(**data.model_dump())
    db.session.add(image)
    try:
        db.session.commit()
    except IntegrityError as error:
        db.session.rollback()
        raise ValueError("An image with this path already exists") from error
    return image

def remove_image(image: Image) -> None:
    for post_image in image.post_images:
        post_image.image = None
    db.session.delete(image)
    db.session.commit()

def update_image(image: Image, data: ImageUpdate) -> Image:
    values = data.model_dump(exclude_unset=True)
    if "path" in values and values["path"] is None:
        raise ValueError("path cannot be null")
    if "path" in values:
        image.path = values["path"]
    try:
        db.session.commit()
    except IntegrityError as error:
        db.session.rollback()
        raise ValueError("An image with this path already exists") from error
    return image

def get_image_post_count(image_id: UUID) -> int:
    return db.session.scalar(
        select(func.count(func.distinct(PostImage.post_id))).where(
            PostImage.image_id == image_id
        )
    ) or 0
