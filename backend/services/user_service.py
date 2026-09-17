from sqlalchemy import select

from ..database import db
from ..models.user import Role, User
from ..schemas.user import UserCreate, UserUpdate

def list_users() -> list[User]:
    return list(db.session.scalars(select(User)).all())

def get_user(id: int) -> User | None:
    return db.session.get(User, id)

def create_user(data: UserCreate) -> User:
    user = User(**data, role=Role.USER)
    user.set_password(data.password.get_secret_value())

    db.session.add(user)
    db.session.commit()
    return user

def remove_user(user: User) -> None:
    db.session.delete(user)
    db.session.commit()
    return None

def update_user(user: User, data: UserUpdate, actor: User | None = None) -> User:
    values = data.model_dump(exclude_unset=True)

    if "username" in values:
        user.username = values["username"]
    if "email" in values:
        user.email = str(values["email"]) if values["email"] else None
    if "role" in values and values["role"] is not None:
        if actor is None or actor.role != Role.ADMIN:
            raise PermissionError("Only an admin can change a user's role")
        user.role = Role(values["role"].value)
    if "password" in values:
        user.set_password(values["password"].get_secret_value())

    db.session.commit()

    return user
