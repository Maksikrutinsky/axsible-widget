import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import relationship

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    is_approved = Column(Boolean, default=False, nullable=False)
    is_admin = Column(Boolean, default=False, nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    sites = relationship("Site", back_populates="owner", cascade="all, delete-orphan")


class Site(Base):
    __tablename__ = "sites"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    domain = Column(String(255), nullable=False, index=True)
    license_key = Column(
        UUID(as_uuid=True),
        default=uuid.uuid4,
        unique=True,
        nullable=False,
        index=True,
    )
    status = Column(String(20), default="active", nullable=False)  # active | inactive
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    owner = relationship("User", back_populates="sites")
    configuration = relationship(
        "Configuration",
        back_populates="site",
        uselist=False,
        cascade="all, delete-orphan",
    )
    issues = relationship("Issue", back_populates="site", cascade="all, delete-orphan")


class Configuration(Base):
    __tablename__ = "configurations"

    id = Column(Integer, primary_key=True, index=True)
    site_id = Column(Integer, ForeignKey("sites.id"), unique=True, nullable=False)

    # Widget display settings
    language = Column(String(10), default="he", nullable=False)
    position = Column(String(10), default="right", nullable=False)  # left | right
    offset_x = Column(Integer, default=0, nullable=False)
    offset_y = Column(Integer, default=0, nullable=False)
    icon_color = Column(String(20), default="#3B82F6", nullable=False)
    icon_size = Column(String(10), default="medium", nullable=False)  # small|medium|large

    # Accessibility statement content (bilingual)
    statement_he = Column(Text, default="", nullable=False)
    statement_en = Column(Text, default="", nullable=False)

    # Modules config — JSONB with { enabled: [...], disabled: [...] }
    modules = Column(JSONB, default=dict, nullable=False)

    site = relationship("Site", back_populates="configuration")


class Issue(Base):
    __tablename__ = "issues"

    id = Column(Integer, primary_key=True, index=True)
    site_id = Column(Integer, ForeignKey("sites.id"), nullable=True)
    license_key = Column(UUID(as_uuid=True), nullable=True, index=True)
    reporter_name = Column(String(255), nullable=False)
    reporter_email = Column(String(255), nullable=False)
    type = Column(String(50), nullable=False)  # navigation|visual|screen-reader|other
    description = Column(Text, nullable=False)
    page_url = Column(String(2048), default="", nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    site = relationship("Site", back_populates="issues")
