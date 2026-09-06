from pydantic import BaseModel, ConfigDict, SecretStr, EmailStr

from datetime import datetime
import enum

from .tag import TagResponse
from .image import ImageResponse

class Status(enum.StrEnum):
    RASCUNHO = "Rascunho"
    PUBLICADO = "Publicado"
    OCULTO = "Oculto"
    APAGADO = "Apagado"

class PostBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    title: str
    subtitle: str
    content: str
    slug: str

    is_fixed: bool

    status: Status
    image: ImageResponse

class PostCreate(PostBase):
    ...

class PostResponse(PostBase):
    id: int
    created_by_id: int

    is_fixed: bool

    status: Status

    created_at: datetime
    updated_at: datetime
    updated_by: int

    tags: list[TagResponse]

    image: ImageResponse