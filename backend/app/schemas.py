
from pydantic import BaseModel, ConfigDict


class IntegrationResponse(BaseModel):
    id: int
    name: str
    slug: str
    category: str
    website: str
    auth_type: str
    description: str | None = None

    model_config = ConfigDict(from_attributes=True)
