from pydantic import BaseModel, ConfigDict

class TagBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    name: str
    importance: int

class TagCreate(TagBase):
    ...

class TagUpdate(TagBase):
    name: str | None = None
    importance: int | None = None

# these are built upon the previous members
class TagResponse(TagBase):
    id: int