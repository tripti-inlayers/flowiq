# backend/auth/router.py
# CHANGES FROM PREVIOUS VERSION:
#   1. Line 29: replaced `from ..database import supabase` with `from db.connection import supabase`
#   2. db_get_user_by_email / db_get_user_by_id: wrapped in try/except because .single() raises PostgrestAPIError when no row found
#   3. REMOVED passlib context completely to fix Python 3.14 / bcrypt 72-byte string value validation errors.
#   4. IMPLEMENTED native bcrypt for hash_password and verify_password.

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import bcrypt  # ✅ Native cryptographic library
from typing import Optional
import uuid

from .config import create_access_token, decode_access_token
from .schemas import RegisterRequest, LoginRequest, TokenResponse, UserOut
from db.connection import supabase

router  = APIRouter(prefix="/auth", tags=["auth"])
bearer  = HTTPBearer(auto_error=False)


# ── Password helpers (Native Bcrypt) ───────────────────────
def hash_password(plain: str) -> str:
    """Generates a secure salt and hashes the plain text password."""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(plain.encode('utf-8'), salt).decode('utf-8')

def verify_password(plain: str, hashed: str) -> bool:
    """Verifies a plain text password against its stored bcrypt hash safely."""
    print("PLAIN:", plain)
    print("PLAIN LEN:", len(str(plain)))
    print("HASH:", hashed[:20] if hashed else None)
    print("HASH LEN:", len(str(hashed)))
    try:
        # Both plain and hashed must be encoded to bytes for native bcrypt
        return bcrypt.checkpw(plain.encode('utf-8'), hashed.encode('utf-8'))
    except Exception:
        return False


# ── DB helpers ────────────────────────────────────────────
def db_get_user_by_email(email: str) -> Optional[dict]:
    try:
        res = supabase.table("users").select("*").eq("email", email).single().execute()
        return res.data
    except Exception:
        return None

def db_get_user_by_id(user_id: str) -> Optional[dict]:
    try:
        res = supabase.table("users").select("*").eq("id", user_id).single().execute()
        return res.data
    except Exception:
        return None

def db_create_user(payload: dict) -> dict:
    res = supabase.table("users").insert(payload).execute()
    return res.data[0]


# ── JWT → current user dependency ────────────────────────
def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer),
) -> dict:
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    payload = decode_access_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    user = db_get_user_by_id(payload.get("sub"))
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


# ── Role guard factory ────────────────────────────────────
def require_roles(*roles: str):
    def _guard(current_user: dict = Depends(get_current_user)):
        if current_user["role"] not in roles:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return current_user
    return _guard


# ── Routes ───────────────────────────────────────────────

@router.post("/register", response_model=TokenResponse, status_code=201)
def register(body: RegisterRequest):
    """Create a new account and return a JWT immediately."""
    if body.role == "kirana_owner" and not body.store_id:
        raise HTTPException(400, "store_id is required for kirana_owner")
    if body.role == "driver" and not body.truck_id:
        raise HTTPException(400, "truck_id is required for driver")

    if db_get_user_by_email(body.email):
        raise HTTPException(409, "Email already registered")

    payload = {
        "id":            str(uuid.uuid4()),
        "name":          body.name,
        "email":         body.email,
        "password_hash": hash_password(body.password),
        "role":          body.role,
        "store_id":      str(body.store_id) if body.store_id else None,
        "truck_id":      str(body.truck_id) if body.truck_id else None,
    }
    user = db_create_user(payload)
    token = create_access_token({"sub": user["id"], "role": user["role"]})
    return TokenResponse(access_token=token, user=user)


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest):
    """Authenticate and return a JWT."""
    user = db_get_user_by_email(body.email)
    print("EMAIL:", body.email)
    print("USER:", user)
    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(401, "Invalid email or password")
    token = create_access_token({"sub": user["id"], "role": user["role"]})
    return TokenResponse(access_token=token, user=user)


@router.post("/logout", status_code=204)
def logout():
    """Stateless JWT logout — frontend clears its localStorage token."""
    return


@router.get("/me", response_model=UserOut)
def me(current_user: dict = Depends(get_current_user)):
    """Return the currently authenticated user's profile."""
    return current_user