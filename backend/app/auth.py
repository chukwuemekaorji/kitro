from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models import User

JWT_ALGORITHM = "HS256"
JWT_EXPIRES_MINUTES = 60 * 24  # 24h - fine for a laptop demo, no refresh-token rotation in this project, but would be a good idea in a real app

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# auto_error=False so a missing header falls through to our own check below instead of
# HTTPBearer's default 403 - missing and invalid tokens should both be 401, not two different codes
bearer_scheme = HTTPBearer(auto_error=False)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)


def create_access_token(subject: str) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=JWT_EXPIRES_MINUTES)
    payload = {"sub": subject, "exp": expires_at}
    return jwt.encode(payload, settings.jwt_secret, algorithm=JWT_ALGORITHM)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if credentials is None:
        raise unauthorized

    try:
        payload = jwt.decode(credentials.credentials, settings.jwt_secret, algorithms=[JWT_ALGORITHM])
    except JWTError:
        raise unauthorized

    email = payload.get("sub")
    if email is None:
        raise unauthorized

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise unauthorized

    return user
