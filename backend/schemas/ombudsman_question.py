from pydantic import AwareDatetime, BaseModel, ConfigDict, Field

from uuid import UUID

from ..models.ombudsman_question import Status, Type

class OmbudsmanQuestionCreate(BaseModel):
    title: str = Field(min_length=1)
    content: str = Field(min_length=1)
    type: Type

class OmbudsmanQuestionUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1)
    content: str | None = Field(default=None, min_length=1)
    type: Type | None = None

class OmbudsmanQuestionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    ombudsman_question_id: UUID
    user_id: str
    title: str
    content: str
    type: Type
    status: Status

    created_at: AwareDatetime
    updated_at: AwareDatetime | None = None
    deleted_at: AwareDatetime | None = None
