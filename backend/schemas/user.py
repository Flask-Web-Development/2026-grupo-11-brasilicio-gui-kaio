from pydantic import BaseModel, ConfigDict, SecretStr, EmailStr

from datetime import datetime
import enum

from uuid import UUID

class Role(enum.StrEnum):
    USER = "User"
    ADMIN = "Admin"

class UserBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    username: str
    email: EmailStr | None = None

    role: Role

class UserCreate(UserBase):
    password: SecretStr

class UserUpdate(BaseModel):
    username: str | None = None
    password: SecretStr | None = None
    role: Role | None = None

class UserResponse(UserBase):
    id: UUID

    created_at: datetime
    updated_at: datetime | None = None