# backend/auth/config.py
# -------------------------------------------------------
# Put these in your .env file (never commit real values!)
# -------------------------------------------------------
#   JWT_SECRET=<generate with: openssl rand -hex 32>
#   JWT_ALGORITHM=HS256
#   JWT_EXPIRE_MINUTES=1440   # 24 hours
# -------------------------------------------------------

import os
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt

JWT_SECRET         = os.getenv("JWT_SECRET", "CHANGE_ME_IN_PRODUCTION")
JWT_ALGORITHM      = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "1440"))


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=JWT_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_access_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except JWTError:
        return None
