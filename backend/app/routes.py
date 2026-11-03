
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Integration
from app.schemas import IntegrationResponse

router = APIRouter(
    prefix="/api/integrations",
    tags=["Integrations"]
)


@router.get("/", response_model=list[IntegrationResponse])
def get_integrations(db: Session = Depends(get_db)):
    return db.query(Integration).all()


@router.get("/{slug}", response_model=IntegrationResponse)
def get_integration(slug: str, db: Session = Depends(get_db)):
    integration = db.query(Integration).filter(
        Integration.slug == slug
    ).first()

    if not integration:
        raise HTTPException(
            status_code=404,
            detail="Integration not found"
        )

    return integration
