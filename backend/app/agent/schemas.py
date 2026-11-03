from pydantic import BaseModel, Field
from typing import Literal


class Evidence(BaseModel):
    claim: str
    source_url: str
    source_type: Literal[
        "official",
        "official_community",
        "third_party",
        "unverified"
    ]
    verification_status: Literal[
        "verified",
        "inferred",
        "unverified"
    ]


class OAuthStep(BaseModel):
    title: str
    description: str
    developer_action_required: bool = True


class OAuthRequirement(BaseModel):
    name: str
    description: str
    required: bool | None = None


class OAuthGuide(BaseModel):
    application_name: str
    official_website: str | None = None

    auth_type: str
    oauth_flow: str | None = None

    difficulty: Literal[
        "Easy",
        "Medium",
        "Hard",
        "Unknown"
    ]

    estimated_setup_time: str
    approval_wait_time: str

    registration_steps: list[OAuthStep]

    required_credentials: list[OAuthRequirement]
    redirect_uri_requirements: list[OAuthRequirement]
    required_scopes: list[OAuthRequirement]

    verification_requirements: list[str]
    potential_blockers: list[str]

    agent_can_do: list[str]
    developer_must_do: list[str]

    evidence: list[Evidence] = Field(default_factory=list)

    limitations: list[str] = Field(default_factory=list)
