from sqlalchemy import Integer, String, DateTime, Enum, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from werkzeug.security import check_password_hash, generate_password_hash

from uuid import UUID, uuid4

from datetime import datetime
import enum

from ..database import db

class Role(enum.StrEnum):
    USER = "User"
    ADMIN = "Admin"

class User(db.Model):
    __tablename__ = "users"
    
    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    username: Mapped[str] = mapped_column(unique=False)
    email: Mapped[str | None] = mapped_column(unique=True, nullable=True, default=None)
    password_hash: Mapped[str] = mapped_column(unique=False)

    role: Mapped[Role] = mapped_column(
        Enum(Role, values_callable=lambda obj: [item.value for item in obj]), unique=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=datetime.now()
    )

    updated_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True,
        onupdate=datetime.now(),
    )

    def get_user_id(self) -> UUID:
        return self.id

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password) -> bool:
        return check_password_hash(self.password_hash, password)