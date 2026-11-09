from pydantic import BaseModel, ConfigDict, Field

from uuid import UUID

from ..models.post_image import UsageType

class PostImageBase(BaseModel):
    image_id: UUID | None = None
    usage_type: UsageType = UsageType.CONTENT
    position: int | None = Field(default=None)
    width: int | None = Field(default=None)
    height: int | None = Field(default=None)
    alt: str | None = None

class PostImageCreate(PostImageBase):
    image_id: UUID

class PostImageUpdate(BaseModel):
    usage_type: UsageType | None = None
    position: int | None = Field(default=None)
    width: int | None = Field(default=None)
    height: int | None = Field(default=None)
    alt: str | None = None

class PostImageResponse(PostImageBase):
    model_config = ConfigDict(from_attributes=True)

    post_image_id: UUID
