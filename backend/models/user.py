from sqlalchemy import Integer, String, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from datetime import datetime
from enum import Enum

from ..database import db

class Role(Enum):
    USER = "User"
    ADMIN = "Admin"

class User(db.Model):
    __tablename__ = "users"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(unique=False)
    email: Mapped[str] = mapped_column(unique=False)
    password_hash: Mapped[str] = mapped_column(unique=False)

    role: Mapped[Role] = mapped_column(unique=False)

    created_at: Mapped[datetime] = mapped_column(unique=False, nullable=False, default=datetime.now)
    updated_at: Mapped[datetime] = mapped_column(unique=False, nullable=True)