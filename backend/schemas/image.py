from pathlib import Path
from pydantic import BaseModel, ConfigDict

from uuid import UUID

class ImageBase(BaseModel):
    path: Path

class ImageCreate(ImageBase):
    ...

class ImageResponse(ImageBase):
    id: UUID