from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from uuid import UUID

from ..database import db
from ..models.image import Image
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
    db.session.delete(image)
    db.session.commit()


def update_image(image: Image, data: ImageUpdate) -> Image:
    values = data.model_dump(exclude_unset=True)
    if values.get("path") is not None:
        image.path = values["path"]
    try:
        db.session.commit()
    except IntegrityError as error:
        db.session.rollback()
        raise ValueError("An image with this path already exists") from error
    return image
