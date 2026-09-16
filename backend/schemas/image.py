from pydantic import BaseModel, ConfigDict

class ImageBase(BaseModel):
    path: str

class ImageCreate(ImageBase):
    ...

class ImageResponse(ImageBase):
    id: int