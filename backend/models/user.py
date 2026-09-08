from sqlalchemy import Integer, String, DateTime, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from werkzeug.security import check_password_hash, generate_password_hash

from datetime import datetime
import enum

from ..database import db

class Role(enum.StrEnum):
    USER = "User"
    ADMIN = "Admin"

class User(db.Model):
    __tablename__ = "users"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(unique=False)
    email: Mapped[str] = mapped_column(unique=False)
    password_hash: Mapped[str] = mapped_column(unique=False)

    role: Mapped[Role] = mapped_column(
        Enum(Role, values_callable=lambda obj: [item.value for item in obj]), unique=False
    )

    created_at: Mapped[datetime] = mapped_column(unique=False, nullable=False, default=datetime.now)
    updated_at: Mapped[datetime] = mapped_column(unique=False, nullable=True)

    def get_user_id(self) -> int:
        return self.id

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password) -> bool:
        return check_password_hash(self.password_hash, password)