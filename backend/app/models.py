
from sqlalchemy import Column, Integer, String, Text
from app.database import Base


# ==========================================
# INTEGRATION MODEL
# ==========================================

class Integration(Base):
    __tablename__ = "integrations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    category = Column(String(100), nullable=False)
    website = Column(String(255), nullable=False)
    auth_type = Column(String(50), default="OAuth 2.0")
    description = Column(Text, nullable=True)


# ==========================================
# OAUTH GUIDE MODEL
# ==========================================

class OAuthGuideRecord(Base):
    __tablename__ = "oauth_guides"

    id = Column(Integer, primary_key=True, index=True)

    # Application identification
    application_name = Column(String(150), nullable=False, index=True)
    slug = Column(String(150), unique=True, nullable=False, index=True)

    # Generated OAuth guide stored as JSON text
    guide_data = Column(Text, nullable=False)

    # Research metadata
    total_sources = Column(Integer, default=0)
    official_sources = Column(Integer, default=0)
    community_sources = Column(Integer, default=0)
    third_party_sources = Column(Integer, default=0)
    unverified_sources = Column(Integer, default=0)

    # Guide generation status
    status = Column(String(50), default="generated")