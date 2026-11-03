
from sqlalchemy import Column, Integer, String, Text
from app.database import Base


class Integration(Base):
    __tablename__ = "integrations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    category = Column(String(100), nullable=False)
    website = Column(String(255), nullable=False)
    auth_type = Column(String(50), default="OAuth 2.0")
    description = Column(Text, nullable=True)
