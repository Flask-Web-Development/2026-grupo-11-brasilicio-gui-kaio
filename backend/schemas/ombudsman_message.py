from pydantic import BaseModel, ConfigDict, Field

from datetime import datetime
from uuid import UUID

class OmbudsmanMessageCreate(BaseModel):
    content: str = Field(min_length=1)

class OmbudsmanMessageUpdate(BaseModel):
    content: str = Field(min_length=1)

class OmbudsmanMessageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    ombudsman_message_id: UUID
    ombudsman_question_id: UUID
    user_id: str
    content: str

    created_at: datetime
    updated_at: datetime | None = None
    deleted_at: datetime | None = None
