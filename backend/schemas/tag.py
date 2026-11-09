from pydantic import BaseModel, ConfigDict, Field

from uuid import UUID


class TagBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    name: str = Field(min_length=1)

class TagCreate(TagBase):
    ...

class TagUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1)

class TagResponse(TagBase):
    tag_id: UUID
