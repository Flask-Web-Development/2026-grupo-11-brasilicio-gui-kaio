from sqlalchemy import DateTime, Enum, String, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from datetime import datetime
import enum

from ..database import db
from .ombudsman_message import OmbudsmanMessage
from .ombudsman_question import OmbudsmanQuestion
from .post import Post

class Role(enum.StrEnum):
    STUDENT = "STUDENT"
    ADMIN = "ADMIN"

class User(db.Model):
    __tablename__ = "User"
    __table_args__ = (
        CheckConstraint("user_id ~ '^[A-Za-z0-9]+$'", "user_check_user_id_format").ddl_if("postgresql"),
    )

    user_id: Mapped[str] = mapped_column(String(20), primary_key=True, nullable=False, comment="matrícula do suap")
    name: Mapped[str | None] = mapped_column(String, nullable=True, comment="nome do usuário pego pela API do suap")
    email: Mapped[str | None] = mapped_column(String, nullable=True, comment="e-mail escolar pego pela API do suap")
    photo: Mapped[str | None] = mapped_column(String, nullable=True, comment="caminho ou url da foto obtida pela API do suap")
    course: Mapped[str | None] = mapped_column(String, nullable=True)
    campus: Mapped[str | None] = mapped_column(String, nullable=True)
    role: Mapped[Role] = mapped_column(Enum(Role, values_callable=lambda obj: [item.value for item in obj], native_enum=False, create_constraint=True), default=Role.STUDENT, nullable=False)

    joined_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.now, nullable=False)

    # FK com Post
    published_posts: Mapped[list["Post"]] = relationship(foreign_keys="Post.published_by", back_populates="publisher")
    updated_posts: Mapped[list["Post"]] = relationship(foreign_keys="Post.updated_by", back_populates="updater")
    deleted_posts: Mapped[list["Post"]] = relationship(foreign_keys="Post.deleted_by", back_populates="deleter")

    # FK com Ouvidoria
    ombudsman_questions: Mapped[list["OmbudsmanQuestion"]] = relationship(back_populates="user")
    ombudsman_messages: Mapped[list["OmbudsmanMessage"]] = relationship(back_populates="user")

    def get_user_id(self) -> str:
        return self.user_id
