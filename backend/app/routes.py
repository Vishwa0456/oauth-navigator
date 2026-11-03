
import re
import json

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Integration, OAuthGuideRecord
from app.schemas import IntegrationResponse

from app.agent.research import research_application
from app.agent.gemini import generate_oauth_guide


router = APIRouter(
    prefix="/api/integrations",
    tags=["Integrations"]
)


# ==========================================
# REQUEST SCHEMA
# ==========================================

class OAuthResearchRequest(BaseModel):
    application_name: str = Field(
        min_length=1,
        max_length=150
    )


# ==========================================
# HELPER FUNCTION
# ==========================================

def generate_slug(application_name: str) -> str:
    """Convert an application name into a URL-friendly slug."""

    slug = application_name.lower().strip()
    slug = re.sub(r"[^a-z0-9]+", "-", slug)
    slug = slug.strip("-")

    if not slug:
        raise ValueError("Invalid application name")

    return slug


# ==========================================
# EXISTING INTEGRATION ENDPOINTS
# ==========================================

@router.get("/", response_model=list[IntegrationResponse])
def get_integrations(db: Session = Depends(get_db)):
    return db.query(Integration).all()


@router.get("/{slug}", response_model=IntegrationResponse)
def get_integration(
    slug: str,
    db: Session = Depends(get_db)
):
    integration = db.query(Integration).filter(
        Integration.slug == slug
    ).first()

    if not integration:
        raise HTTPException(
            status_code=404,
            detail="Integration not found"
        )

    return integration


# ==========================================
# RETRIEVE SAVED OAUTH GUIDE
# ==========================================

@router.get("/guides/{slug}")
def get_oauth_guide(
    slug: str,
    db: Session = Depends(get_db)
):
    guide = db.query(OAuthGuideRecord).filter(
        OAuthGuideRecord.slug == slug
    ).first()

    if not guide:
        raise HTTPException(
            status_code=404,
            detail="OAuth guide not found"
        )

    return {
        "application_name": guide.application_name,
        "slug": guide.slug,
        "status": guide.status,

        "total_sources": guide.total_sources,
        "official_sources": guide.official_sources,
        "community_sources": guide.community_sources,
        "third_party_sources": guide.third_party_sources,
        "unverified_sources": guide.unverified_sources,

        "guide": json.loads(guide.guide_data)
    }


# ==========================================
# AI-POWERED OAUTH RESEARCH ENDPOINT
# ==========================================

@router.post("/research")
def research_oauth_guide(
    request: OAuthResearchRequest,
    db: Session = Depends(get_db)
):
    application_name = request.application_name.strip()

    if not application_name:
        raise HTTPException(
            status_code=400,
            detail="Application name cannot be empty"
        )

    slug = generate_slug(application_name)

    # Check whether a guide already exists.
    existing_guide = db.query(OAuthGuideRecord).filter(
        OAuthGuideRecord.slug == slug
    ).first()

    if existing_guide:
        return {
            "message": "Existing OAuth guide retrieved",
            "cached": True,
            "application_name": existing_guide.application_name,
            "slug": slug,

            "research_statistics": {
                "total_sources": existing_guide.total_sources,
                "official_sources": existing_guide.official_sources,
                "community_sources": existing_guide.community_sources,
                "third_party_sources": existing_guide.third_party_sources,
                "unverified_sources": existing_guide.unverified_sources
            },

            "guide": json.loads(existing_guide.guide_data)
        }

    try:
        # Step 1: Research application documentation.
        research_data = research_application(application_name)

        if not research_data.get("sources"):
            raise HTTPException(
                status_code=404,
                detail="No OAuth documentation found for this application"
            )

        # Step 2: Generate OAuth guide using Gemini.
        guide = generate_oauth_guide(
            application_name,
            research_data
        )

        # Step 3: Store generated guide and research statistics.
        guide_record = OAuthGuideRecord(
            application_name=application_name,
            slug=slug,
            guide_data=guide.model_dump_json(),

            total_sources=research_data.get(
                "total_sources_found", 0
            ),

            official_sources=research_data.get(
                "official_sources", 0
            ),

            community_sources=research_data.get(
                "community_sources", 0
            ),

            third_party_sources=research_data.get(
                "third_party_sources", 0
            ),

            unverified_sources=research_data.get(
                "unverified_sources", 0
            ),

            status="generated"
        )

        db.add(guide_record)
        db.commit()
        db.refresh(guide_record)

        # Step 4: Return generated guide and statistics.
        return {
            "message": "OAuth guide generated successfully",
            "cached": False,
            "application_name": application_name,
            "slug": slug,

            "research_statistics": {
                "total_sources": research_data.get(
                    "total_sources_found", 0
                ),

                "documents_fetched": research_data.get(
                    "total_documents_fetched", 0
                ),

                "official_sources": research_data.get(
                    "official_sources", 0
                ),

                "community_sources": research_data.get(
                    "community_sources", 0
                ),

                "third_party_sources": research_data.get(
                    "third_party_sources", 0
                ),

                "unverified_sources": research_data.get(
                    "unverified_sources", 0
                )
            },

            "guide": guide.model_dump(mode="json")
        }

    except HTTPException:
        db.rollback()
        raise

    except Exception as error:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"OAuth guide generation failed: {str(error)}"
        ) from error