from pydantic import BaseModel, ConfigDict, Field

from datetime import datetime
from uuid import UUID

from ..models.post import Status
from .post_image import PostImageCreate, PostImageResponse
from .tag import TagResponse

class PostBase(BaseModel):
    slug: str = Field(min_length=1)
    title: str = Field(min_length=1)
    subtitle: str | None = None
    content: str = Field(min_length=1)
    is_fixed: bool = False

class PostCreate(PostBase):
    tags: list[UUID] = Field(default_factory=list)
    images: list[PostImageCreate] = Field(default_factory=list)
    status: Status = Status.RASCUNHO

class PostUpdate(BaseModel):
    slug: str | None = Field(default=None, min_length=1)
    title: str | None = Field(default=None, min_length=1)
    subtitle: str | None = None
    content: str | None = Field(default=None, min_length=1)
    is_fixed: bool | None = None
    tags: list[UUID] | None = None
    images: list[PostImageCreate] | None = None

class PostResponse(PostBase):
    model_config = ConfigDict(from_attributes=True)

    post_id: UUID
    status: Status
    tags: list[TagResponse] = Field(default_factory=list)
    post_images: list[PostImageResponse] = Field(default_factory=list)

    published_at: datetime | None = None
    published_by: str | None = None

    updated_at: datetime | None = None
    updated_by: str | None = None

    deleted_at: datetime | None = None
    deleted_by: str | None = None
