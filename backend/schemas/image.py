from pydantic import BaseModel, ConfigDict, Path, UUID

class ImageBase(BaseModel):
    path: Path

class ImageCreate(ImageBase):
    ...

class ImageResponse(ImageBase):
    id: UUID