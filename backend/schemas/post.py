from pydantic import (
    AwareDatetime,
    BaseModel,
    ConfigDict,
    Field,
)

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
    model_config = ConfigDict(extra="forbid")

    status: Status = Status.RASCUNHO
    tags: list[UUID] = Field(default_factory=list)
    images: list[PostImageCreate] = Field(default_factory=list)

class PostUpdate(BaseModel):
    slug: str | None = Field(default=None, min_length=1)
    title: str | None = Field(default=None, min_length=1)
    subtitle: str | None = None
    content: str | None = Field(default=None, min_length=1)
    is_fixed: bool | None = None
    status: Status | None = None
    tags: list[UUID] | None = None
    images: list[PostImageCreate] | None = None

class PostResponse(PostBase):
    model_config = ConfigDict(from_attributes=True)

    post_id: UUID
    status: Status
    tags: list[TagResponse] = Field(default_factory=list)
    post_images: list[PostImageResponse] = Field(default_factory=list)

    published_at: AwareDatetime | None = None
    published_by: str | None = None
    published_by_name: str | None = None

    updated_at: AwareDatetime | None = None
    updated_by: str | None = None
    updated_by_name: str | None = None

    deleted_at: AwareDatetime | None = None
    deleted_by: str | None = None
    deleted_by_name: str | None = None

class PostPublicResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    post_id: UUID
    slug: str
    title: str
    subtitle: str | None = None
    content: str
    is_fixed: bool
    status: Status
    tags: list[TagResponse] = Field(default_factory=list)
    post_images: list[PostImageResponse] = Field(default_factory=list)
    published_at: AwareDatetime | None = None
    published_by_name: str | None = None
    updated_at: AwareDatetime | None = None
    updated_by_name: str | None = None
    deleted_at: AwareDatetime | None = None
    deleted_by_name: str | None = None

class PostPageResponse(BaseModel):
    items: list[PostPublicResponse]
    page: int
    per_page: int
    total: int
    has_next: bool

class PostDashboardResponse(BaseModel):
    total: int
    published: int
    drafts: int
    recent_posts: list[PostResponse]
