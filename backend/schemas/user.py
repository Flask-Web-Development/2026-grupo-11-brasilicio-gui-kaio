from pydantic import BaseModel, ConfigDict, Field, SecretStr, EmailStr

from datetime import datetime
import enum

class Role(enum.StrEnum):
    USER = "User"
    ADMIN = "Admin"

class UserBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    username: str
    email: EmailStr | None = None

class UserCreate(UserBase):
    password: SecretStr

class SuapUserSync(BaseModel):
    username: str
    email: EmailStr | None = None

class SuapPasswordUpdate(BaseModel):
    user_id: int
    password: SecretStr = Field(min_length=8)

class UserUpdate(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    username: str | None = None
    email: EmailStr | None = None
    password: SecretStr | None = None
    role: Role | None = None

class UserResponse(UserBase):
    id: int

    role: Role

    created_at: datetime
    updated_at: datetime | None = None