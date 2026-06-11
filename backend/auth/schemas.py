# backend/auth/schemas.py

from pydantic import BaseModel, EmailStr
from typing import Optional, Literal
from uuid import UUID
from datetime import datetime

RoleType = Literal["kirana_owner", "driver", "shipper", "admin"]


class RegisterRequest(BaseModel):
    name:     str
    email:    EmailStr
    password: str
    role:     RoleType
    store_id: Optional[UUID] = None   # required when role == kirana_owner
    truck_id: Optional[UUID] = None   # required when role == driver


class LoginRequest(BaseModel):
    email:    EmailStr
    password: str


class UserOut(BaseModel):
    id:         UUID
    name:       str
    email:      str
    role:       RoleType
    store_id:   Optional[UUID]
    truck_id:   Optional[UUID]
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type:   str = "bearer"
    user:         UserOut
