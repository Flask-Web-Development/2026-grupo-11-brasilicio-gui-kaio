import secrets
import json
import os
from urllib import error, request
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from ..database import db
from ..models.user import Role, User
from ..schemas.user import UserCreate, UserUpdate

def list_users() -> list[User]:
    return list(db.session.scalars(select(User)).all())

def get_user(id: int) -> User | None:
    return db.session.get(User, id)

def create_user(data: UserCreate) -> User:
    user = User(
        username=data.username,
        email=data.email,
        role=Role.USER,
    )
    user.set_password(data.password.get_secret_value())

    db.session.add(user)
    try:
        db.session.commit()
    except IntegrityError as error:
        db.session.rollback()
        raise ValueError("A user with this email already exists") from error
    return user

def sync_suap_user(username: str, email: str | None) -> User:
    normalized_username = username.strip()
    normalized_email = email.strip() if email else None

    user = db.session.scalar(
        select(User).where(User.username == normalized_username)
    )
    if user is None and normalized_email:
        user = db.session.scalar(select(User).where(User.email == normalized_email))

    if user is None:
        user = User(
            username=normalized_username,
            email=normalized_email,
            role=Role.USER,
        )
        user.set_password(secrets.token_urlsafe(32))
        db.session.add(user)
    elif normalized_email and user.email is None:
        user.email = normalized_email

    try:
        db.session.commit()
    except IntegrityError as error:
        db.session.rollback()
        raise ValueError("A user with this email already exists") from error
    return user

def set_user_password(user: User, password: str) -> User:
    user.set_password(password)
    db.session.commit()
    return user

def authenticate_suap_user(identifier: str, password: str) -> User:
    normalized_identifier = identifier.strip()
    user = db.session.scalar(
        select(User).where(User.email == normalized_identifier)
    ) if "@" in normalized_identifier else None

    suap_username = user.username if user else normalized_identifier
    base_url = os.getenv("SUAP_PUBLIC_API_URL", "https://suap.ifrn.edu.br").rstrip("/")
    payload = json.dumps({
        "username": suap_username,
        "password": password,
    }).encode()
    token_request = request.Request(
        f"{base_url}/api/token/pair",
        data=payload,
        headers={"Content-Type": "application/json", "Accept": "application/json"},
        method="POST",
    )

    try:
        with request.urlopen(token_request, timeout=10) as response:
            token_data = json.loads(response.read())
    except (error.HTTPError, error.URLError, TimeoutError, ValueError) as exc:
        raise ValueError("Invalid SUAP credentials") from exc

    access_token = token_data.get("access")
    if not isinstance(access_token, str) or not access_token:
        raise ValueError("Invalid SUAP authentication response")

    identity_request = request.Request(
        f"{base_url}/api/rh/eu/",
        headers={"Authorization": f"Bearer {access_token}", "Accept": "application/json"},
    )
    try:
        with request.urlopen(identity_request, timeout=10) as response:
            identity = json.loads(response.read())
    except (error.HTTPError, error.URLError, TimeoutError, ValueError) as exc:
        raise ValueError("Unable to retrieve SUAP identity") from exc

    suap_username = next(
        (
            identity.get(field)
            for field in ("identificacao", "username", "matricula")
            if isinstance(identity.get(field), str) and identity.get(field).strip()
        ),
        None,
    )
    if not suap_username:
        raise ValueError("SUAP returned an invalid identity")

    email = identity.get("email")
    email = email.strip() if isinstance(email, str) and email.strip() else None
    existing = db.session.scalar(select(User).where(User.username == suap_username))
    if existing is None and email:
        existing = db.session.scalar(select(User).where(User.email == email))

    if existing is None:
        existing = User(username=suap_username, email=email, role=Role.USER)
        db.session.add(existing)
    elif email and existing.email is None:
        existing.email = email

    existing.set_password(password)
    db.session.commit()
    return existing

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

    try:
        db.session.commit()
    except IntegrityError as error:
        db.session.rollback()
        raise ValueError("A user with this email already exists") from error

    return user
