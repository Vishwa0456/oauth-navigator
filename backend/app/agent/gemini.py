
import os
import json
from pathlib import Path

from dotenv import load_dotenv
from google import genai

from app.agent.schemas import OAuthGuide
from app.agent.prompts import OAUTH_RESEARCH_PROMPT


# ==========================================
# ENVIRONMENT CONFIGURATION
# ==========================================

# Resolve backend/.env regardless of terminal location.
ENV_PATH = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=ENV_PATH)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv(
    "GEMINI_MODEL",
    "gemini-3.5-flash-lite"
)

if not GEMINI_API_KEY:
    raise ValueError(
        f"GEMINI_API_KEY is missing. Check your environment file: {ENV_PATH}"
    )

client = genai.Client(api_key=GEMINI_API_KEY)


# ==========================================
# GEMINI OAUTH GUIDE GENERATOR
# ==========================================


def generate_oauth_guide(
    app_name: str,
    research_data: dict
) -> OAuthGuide:
    """
    Analyze researched documentation using Gemini.
    Attach evidence URLs independently using Python
    to preserve source provenance.
    """

    if not app_name or not app_name.strip():
        raise ValueError("Application name cannot be empty")

    sources = research_data.get("sources", [])

    if not sources:
        raise ValueError("No research documentation available")

    priority = {
        "official": 0,
        "official_community": 1,
        "third_party": 2,
        "unverified": 3
    }

    selected_sources = sorted(
        sources,
        key=lambda item: priority.get(
            item.get("source_type", "unverified"), 3
        )
    )[:6]

    documentation = []

    for source in selected_sources:
        document = source.get("document", {})

        if document.get("fetch_status") != "success":
            continue

        documentation.append({
            "title": document.get("title"),
            "url": source.get("url"),
            "source_type": source.get(
                "source_type", "unverified"
            ),
            "content": (document.get("content") or "")[:8000]
        })

    if not documentation:
        raise ValueError(
            "No successfully fetched documentation available"
        )

    prompt = OAUTH_RESEARCH_PROMPT.format(
        app_name=app_name,
        documentation=json.dumps(
            documentation,
            indent=2,
            ensure_ascii=False
        )
    )

    try:
        response = client.interactions.create(
            model=GEMINI_MODEL,
            input=prompt,
            response_format={
                "type": "text",
                "mime_type": "application/json",
                "schema": OAuthGuide.model_json_schema()
            }
        )

        response_text = response.output_text

        if not response_text:
            raise RuntimeError(
                "Gemini returned an empty response"
            )

        guide = OAuthGuide.model_validate_json(response_text)

        # Build evidence independently from actual research results.
        evidence = []

        for source in documentation:
            evidence.append({
                "claim": (
                    "Documentation source retrieved for research. "
                    "Individual OAuth claims require verification."
                ),
                "source_url": source["url"],
                "source_type": source["source_type"],
                "verification_status": "unverified"
            })

        # Replace Gemini-generated evidence with source-backed records.
        guide.evidence = evidence

        return guide

    except Exception as error:

        status_code = getattr(error, "status_code", None)

        if status_code == 503:
            message = (
                "Gemini is temporarily unavailable or experiencing "
                "high demand. Try again later."
            )

        elif status_code == 429:
            message = (
                "Gemini request limit or quota reached. "
                "Check your API usage and quota."
            )

        elif status_code in (400, 401, 403):
            message = (
                "Gemini rejected the request. Check the API key, "
                "permissions, model availability, and request configuration."
            )

        else:
            message = (
                f"Gemini guide generation failed: {error}"
            )

        raise RuntimeError(message) from error