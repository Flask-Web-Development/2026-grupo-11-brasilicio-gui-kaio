from pydantic import BaseModel, ConfigDict

from uuid import UUID

class PostTagBase(BaseModel):
    post_id: UUID
    tag_id: UUID

class PostTagCreate(PostTagBase):
    pass

class PostTagResponse(PostTagBase):
    model_config = ConfigDict(from_attributes=True)
