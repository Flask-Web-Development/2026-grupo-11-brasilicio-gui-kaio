import json
import os
from urllib import error, request

from sqlalchemy import select

from ..database import db
from ..models.user import User
from ..schemas.user import SuapUserSync, UserCreate, UserUpdate


def list_users() -> list[User]:
    return list(db.session.scalars(select(User)).all())


def get_user(user_id: str) -> User | None:
    return db.session.get(User, user_id)


def create_user(data: UserCreate) -> User:
    user = User(**data.model_dump())
    db.session.add(user)
    db.session.commit()
    return user


def sync_suap_user(data: SuapUserSync) -> User:
    user = get_user(data.user_id)
    profile = data.model_dump(exclude={"user_id"}, exclude_unset=True)

    if user is None:
        user = User(user_id=data.user_id, **profile)
        db.session.add(user)
    else:
        for field, value in profile.items():
            setattr(user, field, value)

    db.session.commit()
    return user


def authenticate_suap_user(identifier: str, password: str) -> User:
    normalized_identifier = identifier.strip()
    user = db.session.scalar(
        select(User).where(User.email == normalized_identifier)
    ) if "@" in normalized_identifier else None
    suap_username = user.user_id if user else normalized_identifier

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

    access_token = token_data.get("access") if isinstance(token_data, dict) else None
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

    if not isinstance(identity, dict):
        raise ValueError("SUAP returned an invalid identity")

    user_id = next(
        (
            identity[field].strip()
            for field in ("identificacao", "username", "matricula")
            if isinstance(identity.get(field), str) and identity[field].strip()
        ),
        None,
    )
    if user_id is None:
        raise ValueError("SUAP returned an invalid identity")

    email = identity.get("email")
    profile = {
        "user_id": user_id,
        "name": identity.get("nome") or identity.get("name"),
        "email": email.strip() if isinstance(email, str) and email.strip() else None,
        "photo": identity.get("url_foto_75x100") or identity.get("photo"),
        "course": identity.get("curso") or identity.get("course"),
        "campus": identity.get("campus"),
    }
    return sync_suap_user(SuapUserSync.model_validate(profile))


def remove_user(user: User) -> None:
    db.session.delete(user)
    db.session.commit()


def update_user(user: User, data: UserUpdate) -> User:
    values = data.model_dump(exclude_unset=True)
    for field, value in values.items():
        setattr(user, field, value)
    db.session.commit()
    return user
