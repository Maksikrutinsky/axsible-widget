from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


# ── Auth ──


class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    id: int
    email: str
    is_approved: bool
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ── Sites ──


class SiteCreate(BaseModel):
    domain: str = Field(min_length=3, max_length=255)


class SiteOut(BaseModel):
    id: int
    domain: str
    license_key: UUID
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# ── Configuration ──


class ModulesConfig(BaseModel):
    enabled: list[str] = []
    disabled: list[str] = []


class ConfigUpdate(BaseModel):
    language: Optional[str] = None
    position: Optional[str] = None
    offset_x: Optional[int] = None
    offset_y: Optional[int] = None
    icon_color: Optional[str] = None
    icon_size: Optional[str] = None
    statement_he: Optional[str] = None
    statement_en: Optional[str] = None
    modules: Optional[ModulesConfig] = None


class ConfigOut(BaseModel):
    id: int
    site_id: int
    language: str
    position: str
    offset_x: int
    offset_y: int
    icon_color: str
    icon_size: str
    statement_he: str
    statement_en: str
    modules: dict

    class Config:
        from_attributes = True


# ── Widget public config (returned to the widget) ──


class WidgetConfigResponse(BaseModel):
    """Shape matching the widget's RemoteConfig interface."""

    clientId: str
    theme: dict | None = None
    modules: dict | None = None
    defaultProfile: str | None = None
    statementUrl: str | None = None
    reportEndpoint: str | None = None


# ── Issues ──


class IssueCreate(BaseModel):
    fullName: str = Field(min_length=1, max_length=255)
    email: EmailStr
    category: str = Field(min_length=1, max_length=50)
    description: str = Field(min_length=1)
    pageUrl: str = ""
    timestamp: str = ""


class IssueOut(BaseModel):
    id: int
    site_id: int | None
    reporter_name: str
    reporter_email: str
    type: str
    description: str
    page_url: str
    created_at: datetime

    class Config:
        from_attributes = True


# ── Admin ──


class AdminUserOut(UserOut):
    sites_count: int = 0


class AdminDashboard(BaseModel):
    total_users: int
    approved_users: int
    pending_users: int
    total_sites: int
    active_sites: int
    total_issues: int
