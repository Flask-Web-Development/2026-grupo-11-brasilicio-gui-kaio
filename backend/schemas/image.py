from pydantic import BaseModel, ConfigDict, Field

from uuid import UUID

class ImageBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    path: str = Field(min_length=1)

class ImageCreate(ImageBase):
    ...

class ImageResponse(ImageBase):
    image_id: UUID
