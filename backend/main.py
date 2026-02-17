"""
Axsible (EWA) Accessibility Widget — SaaS Backend
FastAPI + SQLAlchemy + PostgreSQL (Supabase)
"""

import logging
import traceback
import uuid

from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.orm import Session

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from auth import (
    create_access_token,
    get_admin_user,
    get_approved_user,
    get_current_user,
    hash_password,
    verify_password,
)
from database import Base, engine, get_db
from models import Configuration, Issue, Site, User
from schemas import (
    AdminDashboard,
    ConfigOut,
    ConfigUpdate,
    IssueCreate,
    IssueOut,
    SiteCreate,
    SiteOut,
    Token,
    UserLogin,
    UserOut,
    UserRegister,
    WidgetConfigResponse,
)

# ── App ──
app = FastAPI(
    title="Axsible Widget API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)


@app.on_event("startup")
def on_startup():
    """Create tables if they don't exist. Non-fatal — Supabase may already have them."""
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        logger.warning(f"Could not run create_all (tables may already exist): {e}")


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Return detailed errors in JSON instead of plain 'Internal Server Error'."""
    logger.error(f"Unhandled error on {request.method} {request.url.path}: {exc}")
    logger.error(traceback.format_exc())
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc), "type": type(exc).__name__},
    )


# ── CORS — must allow any origin for widget embedding ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Health check
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


@app.get("/")
def root():
    return {"status": "ok", "service": "Axsible Widget API"}


@app.get("/health/db")
def health_db(db: Session = Depends(get_db)):
    """Check database connectivity."""
    db.execute(text("SELECT 1"))
    return {"status": "ok", "database": "connected"}


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  AUTH
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


@app.post("/api/auth/register", response_model=UserOut, status_code=201)
def register(body: UserRegister, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == body.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=body.email,
        password_hash=hash_password(body.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@app.post("/api/auth/login", response_model=Token)
def login(body: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()
    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(user.id, user.is_admin)
    return {"access_token": token}


@app.get("/api/auth/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)):
    return user


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  SITES (requires approved user)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


@app.get("/api/sites", response_model=list[SiteOut])
def list_sites(user: User = Depends(get_approved_user), db: Session = Depends(get_db)):
    return db.query(Site).filter(Site.owner_id == user.id).all()


@app.post("/api/sites", response_model=SiteOut, status_code=201)
def create_site(
    body: SiteCreate,
    user: User = Depends(get_approved_user),
    db: Session = Depends(get_db),
):
    # Normalize domain
    domain = body.domain.lower().strip().removeprefix("https://").removeprefix("http://").rstrip("/")

    existing = (
        db.query(Site)
        .filter(Site.domain == domain, Site.owner_id == user.id)
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="Domain already registered")

    site = Site(owner_id=user.id, domain=domain, license_key=uuid.uuid4())
    db.add(site)
    db.flush()

    # Auto-create default configuration
    config = Configuration(site_id=site.id, modules={})
    db.add(config)
    db.commit()
    db.refresh(site)
    return site


@app.delete("/api/sites/{site_id}", status_code=204)
def delete_site(
    site_id: int,
    user: User = Depends(get_approved_user),
    db: Session = Depends(get_db),
):
    site = db.query(Site).filter(Site.id == site_id, Site.owner_id == user.id).first()
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")
    db.delete(site)
    db.commit()


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  CONFIGURATION (requires approved user)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


@app.get("/api/sites/{site_id}/config", response_model=ConfigOut)
def get_config(
    site_id: int,
    user: User = Depends(get_approved_user),
    db: Session = Depends(get_db),
):
    site = db.query(Site).filter(Site.id == site_id, Site.owner_id == user.id).first()
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")
    if not site.configuration:
        raise HTTPException(status_code=404, detail="Configuration not found")
    return site.configuration


@app.put("/api/sites/{site_id}/config", response_model=ConfigOut)
def update_config(
    site_id: int,
    body: ConfigUpdate,
    user: User = Depends(get_approved_user),
    db: Session = Depends(get_db),
):
    site = db.query(Site).filter(Site.id == site_id, Site.owner_id == user.id).first()
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")

    config = site.configuration
    if not config:
        config = Configuration(site_id=site.id)
        db.add(config)

    updates = body.model_dump(exclude_unset=True)
    if "modules" in updates and updates["modules"] is not None:
        updates["modules"] = updates["modules"].model_dump() if hasattr(updates["modules"], "model_dump") else updates["modules"]

    for key, value in updates.items():
        setattr(config, key, value)

    db.commit()
    db.refresh(config)
    return config


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  PUBLIC WIDGET API — config by license_key
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


@app.get("/api/a11y-config/{license_key}", response_model=WidgetConfigResponse)
def get_widget_config(license_key: str, request: Request, db: Session = Depends(get_db)):
    """
    Public endpoint called by the widget.
    The license_key is the widget's `clientId`.
    Verifies the origin matches the registered domain.
    """
    try:
        key_uuid = uuid.UUID(license_key)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid license key format")

    site = db.query(Site).filter(Site.license_key == key_uuid).first()
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")

    if site.status != "active":
        raise HTTPException(status_code=403, detail="Site license is inactive")

    # Origin check — verify request comes from the registered domain
    origin = request.headers.get("origin", "") or request.headers.get("referer", "")
    if origin:
        origin_domain = (
            origin.lower()
            .removeprefix("https://")
            .removeprefix("http://")
            .split("/")[0]
            .split(":")[0]
        )
        # Allow localhost for development, otherwise verify domain
        if origin_domain not in ("localhost", "127.0.0.1", "") and site.domain not in origin_domain:
            raise HTTPException(status_code=403, detail="Origin not authorized for this license")

    config = site.configuration

    # Build response matching the widget's RemoteConfig interface
    theme = None
    modules_data = None
    statement_url = None

    if config:
        theme = {
            "primaryColor": config.icon_color,
            "position": config.position,
            "buttonSize": config.icon_size,
        }

        if config.modules:
            modules_data = config.modules

        if config.statement_he or config.statement_en:
            statement_url = config.statement_he or config.statement_en

    return WidgetConfigResponse(
        clientId=str(site.license_key),
        theme=theme,
        modules=modules_data,
        statementUrl=statement_url,
        reportEndpoint=f"/api/a11y-report/{site.license_key}",
    )


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  PUBLIC WIDGET API — issue reporting
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


@app.post("/api/a11y-report", status_code=201)
def report_issue_generic(body: IssueCreate, db: Session = Depends(get_db)):
    """Widget issue report without a license key (fallback)."""
    issue = Issue(
        reporter_name=body.fullName,
        reporter_email=body.email,
        type=body.category,
        description=body.description,
        page_url=body.pageUrl,
    )
    db.add(issue)
    db.commit()
    return {"status": "received"}


@app.post("/api/a11y-report/{license_key}", status_code=201)
def report_issue(license_key: str, body: IssueCreate, db: Session = Depends(get_db)):
    """Widget issue report linked to a specific site."""
    try:
        key_uuid = uuid.UUID(license_key)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid license key")

    site = db.query(Site).filter(Site.license_key == key_uuid).first()

    issue = Issue(
        site_id=site.id if site else None,
        license_key=key_uuid,
        reporter_name=body.fullName,
        reporter_email=body.email,
        type=body.category,
        description=body.description,
        page_url=body.pageUrl,
    )
    db.add(issue)
    db.commit()
    return {"status": "received"}


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  MY ISSUES (authenticated user sees own site issues)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


@app.get("/api/sites/{site_id}/issues", response_model=list[IssueOut])
def list_site_issues(
    site_id: int,
    user: User = Depends(get_approved_user),
    db: Session = Depends(get_db),
):
    site = db.query(Site).filter(Site.id == site_id, Site.owner_id == user.id).first()
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")
    return db.query(Issue).filter(Issue.site_id == site.id).order_by(Issue.created_at.desc()).all()


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  ADMIN
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


@app.get("/api/admin/dashboard", response_model=AdminDashboard)
def admin_dashboard(
    _admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db),
):
    total_users = db.query(User).count()
    approved = db.query(User).filter(User.is_approved == True).count()  # noqa: E712
    total_sites = db.query(Site).count()
    active_sites = db.query(Site).filter(Site.status == "active").count()
    total_issues = db.query(Issue).count()

    return AdminDashboard(
        total_users=total_users,
        approved_users=approved,
        pending_users=total_users - approved,
        total_sites=total_sites,
        active_sites=active_sites,
        total_issues=total_issues,
    )


@app.get("/api/admin/users", response_model=list[UserOut])
def admin_list_users(
    _admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db),
):
    return db.query(User).order_by(User.created_at.desc()).all()


@app.patch("/api/admin/users/{user_id}/approve", response_model=UserOut)
def admin_approve_user(
    user_id: int,
    _admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_approved = True
    db.commit()
    db.refresh(user)
    return user


@app.patch("/api/admin/users/{user_id}/revoke", response_model=UserOut)
def admin_revoke_user(
    user_id: int,
    _admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_approved = False
    db.commit()
    db.refresh(user)
    return user


@app.get("/api/admin/sites", response_model=list[SiteOut])
def admin_list_sites(
    _admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db),
):
    return db.query(Site).order_by(Site.created_at.desc()).all()


@app.get("/api/admin/issues", response_model=list[IssueOut])
def admin_list_issues(
    _admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db),
):
    return db.query(Issue).order_by(Issue.created_at.desc()).all()
