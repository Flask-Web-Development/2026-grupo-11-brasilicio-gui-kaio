from pydantic import BaseModel, ConfigDict, SecretStr, EmailStr

from datetime import datetime
import enum

class Role(enum.StrEnum):
    USER = "User"
    ADMIN = "Admin"

class UserBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    username: str
    email: EmailStr

    role: Role

class UserCreate(UserBase):
    password: SecretStr

class UserResponse(UserBase):
    id: int

    created_at: datetime
    updated_at: datetime