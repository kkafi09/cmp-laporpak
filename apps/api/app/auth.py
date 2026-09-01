import base64
import binascii
import hashlib
import hmac
import json
import os
import secrets
import time
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import User

if os.getenv("APP_ENV") == "production" and not os.getenv("JWT_SECRET"):
    raise RuntimeError("JWT_SECRET wajib diisi pada production")
SECRET = os.getenv("JWT_SECRET", "laporpak-development-secret-change-me").encode()
bearer = HTTPBearer(auto_error=False)

def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 310000)
    return f"pbkdf2_sha256$310000${_b64(salt)}${_b64(digest)}"

def verify_password(password: str, stored: str) -> bool:
    try:
        algorithm, iterations, salt, digest = stored.split("$")
        if algorithm != "pbkdf2_sha256": return False
        actual = hashlib.pbkdf2_hmac("sha256", password.encode(), base64.urlsafe_b64decode(salt + "=" * (-len(salt) % 4)), int(iterations))
        return hmac.compare_digest(_b64(actual), digest)
    except (ValueError, binascii.Error):
        return False

def _b64(value: bytes) -> str:
    return base64.urlsafe_b64encode(value).rstrip(b"=").decode()

def create_token(user: User) -> str:
    header = _b64(b'{"alg":"HS256","typ":"JWT"}')
    payload = _b64(json.dumps({"sub": user.id, "role": user.role, "exp": int(time.time()) + 86400}).encode())
    signature = _b64(hmac.new(SECRET, f"{header}.{payload}".encode(), hashlib.sha256).digest())
    return f"{header}.{payload}.{signature}"

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer), db: Session = Depends(get_db)) -> User:
    if not credentials:
        raise HTTPException(status_code=401, detail="Autentikasi diperlukan")
    try:
        header, payload, signature = credentials.credentials.split(".")
        expected = _b64(hmac.new(SECRET, f"{header}.{payload}".encode(), hashlib.sha256).digest())
        data = json.loads(base64.urlsafe_b64decode(payload + "=" * (-len(payload) % 4)))
        if not hmac.compare_digest(signature, expected) or data.get("exp", 0) < time.time():
            raise ValueError()
    except (ValueError, KeyError, json.JSONDecodeError, binascii.Error):
        raise HTTPException(status_code=401, detail="Token tidak valid atau telah kedaluwarsa")
    user = db.query(User).filter(User.id == data.get("sub"), User.is_active == True).first()
    if not user:
        raise HTTPException(status_code=401, detail="User tidak aktif atau tidak ditemukan")
    return user

def require_admin(user: User = Depends(get_current_user)) -> User:
    if user.role not in {"ADMIN_ASN", "SUPER_ADMIN"}:
        raise HTTPException(status_code=403, detail="Akses admin diperlukan")
    return user
