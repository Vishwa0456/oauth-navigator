# OAuth Navigator – AI-Powered OAuth Integration Guide Platform

OAuth Navigator is an AI-powered platform that helps developers understand and configure OAuth integrations for applications they want to connect with their AI agents.

Instead of manually searching through scattered documentation, developers can search for an application and receive a structured OAuth integration guide containing registration instructions, required credentials, redirect URI requirements, scopes, potential blockers, and developer responsibilities.

The platform uses web research and generative AI to discover and organize OAuth documentation, while distinguishing official, community, third-party, and unverified sources.

## Key Features

- **Application Search:** Search for existing application integrations.
- **AI-Powered Research:** Research OAuth documentation for applications that are not already available.
- **OAuth Guide Generation:** Generate structured integration guides using Google Gemini.
- **Evidence Classification:** Classify research sources as official, official community, third-party, or unverified.
- **Research Statistics:** Display source counts to communicate the quality and provenance of research.
- **Guide Persistence:** Store generated guides in an SQLite database.
- **Cached Retrieval:** Retrieve previously generated guides without repeating the research process.
- **Developer Guidance:** Separate tasks an AI agent can perform from tasks requiring developer involvement.

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React, Vite |
| Styling | Tailwind CSS |
| Backend | Python, FastAPI |
| Database | SQLite |
| ORM | SQLAlchemy |
| AI Integration | Google Gemini |
| Web Research | Tavily |
| Data Validation | Pydantic |
| HTTP Requests | HTTPX |
| HTML Parsing | BeautifulSoup |
| Version Control | Git, GitHub |

## System Architecture

```text
                 Developer
                     |
                     v
              React Frontend
                     |
                     v
                FastAPI
                     |
             Search Application
                     |
             +-------+-------+
             |               |
             v               v
        SQLite Database   Research Agent
             |               |
             |               v
             |          Tavily Search
             |               |
             |               v
             |       Documentation Fetching
             |               |
             |               v
             |       Source Classification
             |               |
             |               v
             |        Google Gemini
             |               |
             |               v
             |        OAuth Guide
             |               |
             +-------+-------+
                     |
                     v
              React Frontend
                     |
                     v
             Generated Guide
```

## Application Workflow

1. A developer searches for an application by name.
2. The frontend sends the request to the FastAPI backend.
3. The backend checks whether a previously generated guide exists in SQLite.
4. If a guide exists, the backend returns the cached guide.
5. If no guide exists, the research agent searches for relevant documentation using Tavily.
6. The research agent fetches available documentation and classifies sources.
7. Google Gemini processes the collected research and generates a structured OAuth guide.
8. Pydantic validates the generated guide against the expected schema.
9. The guide and research statistics are stored in SQLite.
10. The frontend displays the generated guide.

## OAuth Guide Information

Generated guides are designed to include:

- Application name and official website.
- Authentication type and OAuth flow.
- Setup difficulty.
- Estimated local setup effort.
- Provider approval waiting requirements.
- OAuth registration steps.
- Required credentials.
- Redirect URI requirements.
- Required OAuth scopes.
- Verification requirements.
- Potential blockers.
- Actions an AI agent can perform.
- Actions requiring developer involvement.
- Evidence sources and limitations.

Setup and approval estimates should be treated as unknown or variable when reliable documentation does not establish them.

## Evidence Classification

OAuth Navigator classifies discovered sources into four categories:

| Source Type | Description |
|---|---|
| Official | Documentation from recognized application-provider domains |
| Official Community | Community resources hosted on recognized provider platforms |
| Third Party | External documentation and resources |
| Unverified | Sources whose authority has not been established |

The application also tracks source statistics, including the total number of discovered sources and the number in each classification.

**Important:** Source classification establishes source provenance, not the factual accuracy of every individual OAuth claim. A retrieved document does not automatically mean that its OAuth instructions have been independently verified or tested.

## Project Structure

```text
oauth-navigator/
|
├── backend/
│   ├── app/
│   │   ├── agent/
│   │   │   ├── __init__.py
│   │   │   ├── gemini.py
│   │   │   ├── prompts.py
│   │   │   ├── research.py
│   │   │   └── schemas.py
│   │   │
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── routes.py
│   │   └── schemas.py
│   │
│   ├── main.py
│   ├── seed.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
│
├── .gitignore
└── README.md
```

## Installation and Setup

### Prerequisites

- Python 3.10 or later.
- Node.js and npm.
- Git.
- Google Gemini API key.
- Tavily API key.

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd oauth-navigator
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python3 -m venv venv
```

Activate it:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file inside the `backend` directory:

```env
GEMINI_API_KEY=your_gemini_api_key
TAVILY_API_KEY=your_tavily_api_key
GEMINI_MODEL=gemini-3.5-flash-lite
```

Replace the placeholder values with your own API credentials.

Never commit API keys or the `.env` file to GitHub.

### 4. Start the Backend

From the `backend` directory:

```bash
uvicorn main:app --reload
```

Backend URL:

```text
http://localhost:8000
```

FastAPI documentation:

```text
http://localhost:8000/docs
```

### 5. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/integrations/` | Retrieve available integrations |
| GET | `/api/integrations/{slug}` | Retrieve an integration |
| POST | `/api/integrations/research` | Research and generate an OAuth guide |
| GET | `/api/integrations/guides/{slug}` | Retrieve a saved OAuth guide |
| GET | `/health` | Check backend health |

### Example Research Request

```json
{
  "application_name": "MyJio"
}
```

The backend checks for an existing guide before starting a new research operation.

## Security Considerations

- API credentials are stored in environment variables.
- Environment files are excluded through `.gitignore`.
- Generated guides are validated using Pydantic.
- External documentation should be treated as untrusted input.
- Source classification should not be interpreted as independent verification of OAuth claims.
- Production deployment requires stronger URL validation and SSRF protections.

## Current Limitations

- The project demonstrates a selected set of integrations rather than a fully populated library of 100 applications.
- OAuth setup instructions depend on the availability and quality of external documentation.
- Source classification uses configured provider-domain mappings and does not independently prove domain ownership.
- Generated OAuth instructions are guidance, not proof that an OAuth application has been registered or an authorization flow has been successfully tested.
- Provider approval timelines may be unknown or variable.
- Production deployment requires additional security hardening, persistent database infrastructure, and deployment configuration.

## Future Enhancements

- Expand the integration library to support 100+ applications.
- Add claim-level evidence verification.
- Improve provider-domain discovery and classification.
- Introduce secure URL fetching with SSRF protection.
- Add guide refresh and version history.
- Support sharing generated guides through public URLs.
- Deploy the frontend and backend with persistent database storage.

## Project Objective

OAuth Navigator aims to reduce the research and configuration effort involved in integrating third-party applications with AI agents by providing structured, evidence-aware OAuth implementation guidance.

**Built with React, FastAPI, Google Gemini, Tavily, and SQLite.**