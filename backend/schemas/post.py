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

class PostUpdate(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    title: str | None = None
    subtitle: str | None = None
    content: str | None = None
    slug: str | None = None

    is_fixed: bool | None = None

    status: Status | None = None
    image: ImageResponse | None = None

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