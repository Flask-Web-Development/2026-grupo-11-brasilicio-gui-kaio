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

class UserCreate(UserBase):
    role: Role #!!!validate on backend!!!

class UserResponse(UserBase):
    role: Role

    created_at: datetime
    updated_at: datetime