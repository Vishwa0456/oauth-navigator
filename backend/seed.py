from app.database import SessionLocal
from app.models import Integration

db = SessionLocal()

integrations = [
    Integration(
        name="Google Drive",
        slug="google-drive",
        category="Productivity",
        website="https://drive.google.com",
        auth_type="OAuth 2.0",
        description="Cloud storage and file management platform."
    ),
    Integration(
        name="Slack",
        slug="slack",
        category="Communication",
        website="https://slack.com",
        auth_type="OAuth 2.0",
        description="Team communication and collaboration platform."
    ),
    Integration(
        name="Notion",
        slug="notion",
        category="Productivity",
        website="https://www.notion.com",
        auth_type="OAuth 2.0",
        description="Workspace for notes, documentation and project management."
    ),
    Integration(
        name="GitHub",
        slug="github",
        category="Developer Tools",
        website="https://github.com",
        auth_type="OAuth 2.0",
        description="Code hosting and software development collaboration platform."
    )
]

try:
    for integration in integrations:
        existing = db.query(Integration).filter_by(
            slug=integration.slug
        ).first()

        if not existing:
            db.add(integration)

    db.commit()
    print("Integration records inserted successfully!")

except Exception as error:
    db.rollback()
    print(f"Error inserting records: {error}")

finally:
    db.close()
