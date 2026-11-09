from pydantic import BaseModel, ConfigDict, EmailStr, Field

from datetime import datetime
from typing import Annotated

from ..models.user import Role

UserId = Annotated[str, Field(min_length=1, max_length=20, pattern=r"^[A-Za-z0-9]+$", description="Matrícula do usuário no SUAP.")]

class UserBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: UserId
    name: str | None = None
    email: EmailStr | None = None
    photo: str | None = None
    course: str | None = None
    campus: str | None = None

class UserCreate(UserBase):
    '''Dados cadastrais obtidos após autenticação bem-sucedida no SUAP.'''

class SuapUserSync(UserBase):
    '''Dados usados para sincronizar o cadastro local com o SUAP.'''

class UserUpdate(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    name: str | None = None
    email: EmailStr | None = None
    photo: str | None = None
    course: str | None = None
    campus: str | None = None

class UserResponse(UserBase):
    role: Role
    joined_at: datetime
