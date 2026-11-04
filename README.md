# OAuth Navigator – AI-Powered OAuth Integration Guide Platform

**OAuth Navigator** is an AI-powered platform that helps developers understand and configure OAuth integrations for applications they want to connect with their AI agents.

Instead of manually searching through scattered documentation, developers can search for an application and receive a structured OAuth integration guide containing registration instructions, required credentials, redirect URI requirements, scopes, potential blockers, and developer responsibilities.

The platform uses web research and generative AI to discover and organize OAuth documentation, while distinguishing official, community, third-party, and unverified sources.

## Live Application

**Production URL:** https://oauth-navigator.vercel.app

**Backend API:** https://oauth-navigator-backend.onrender.com

**API Documentation:** https://oauth-navigator-backend.onrender.com/docs

**Backend Health Check:** https://oauth-navigator-backend.onrender.com/health

The frontend and backend are deployed separately, with Neon PostgreSQL providing persistent production database storage.

## Key Features

- **Application Search:** Search for existing application integrations.
- **AI-Powered Research:** Research OAuth documentation for applications that are not already available.
- **OAuth Guide Generation:** Generate structured integration guides using Google Gemini.
- **Web Research:** Discover relevant provider documentation using Tavily.
- **Evidence Classification:** Classify research sources as official, official community, third-party, or unverified.
- **Research Statistics:** Display source counts to communicate the quality and provenance of research.
- **Guide Persistence:** Store generated guides in a database.
- **Cached Retrieval:** Retrieve previously generated guides without repeating the research process.
- **Developer Guidance:** Separate tasks an AI agent can perform from tasks requiring developer involvement.
- **Production Deployment:** Deploy the frontend, backend, and database using Vercel, Render, and Neon PostgreSQL.

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React, Vite |
| Styling | Tailwind CSS v4 |
| UI Icons | Lucide React |
| Routing | React Router |
| HTTP Client | Axios |
| Backend | Python, FastAPI |
| Database | SQLite (Local), Neon PostgreSQL (Production) |
| ORM | SQLAlchemy |
| AI Integration | Google Gemini |
| Web Research | Tavily |
| Data Validation | Pydantic |
| HTTP Requests | HTTPX |
| HTML Parsing | BeautifulSoup |
| Version Control | Git, GitHub |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |
| Production Database Hosting | Neon PostgreSQL |

## System Architecture

### Production Architecture

```text
                    Developer
                        |
                        v
                Vercel Frontend
                 React + Vite
                        |
                  HTTPS / REST API
                        |
                        v
                 Render Backend
                    FastAPI
                        |
              +---------+---------+
              |                   |
              v                   v
        Neon PostgreSQL       Research Agent
          Database                |
              |                   v
              |              Tavily Search
              |                   |
              |                   v
              |          Documentation Fetching
              |                   |
              |                   v
              |          Source Classification
              |                   |
              |                   v
              |             Google Gemini
              |                   |
              |                   v
              |            Structured Guide
              |                   |
              +---------+---------+
                        |
                        v
                 API Response
                        |
                        v
                Vercel Frontend
                        |
                        v
                 Generated Guide
```

### Local Development Architecture

```text
React Frontend (localhost:5173)
              |
              v
FastAPI Backend (localhost:8000)
              |
        +-----+------+
        |            |
        v            v
  SQLite Database  Research Agent
                       |
                 Tavily + Gemini
```

## Application Workflow

1. A developer searches for an application by name.
2. The frontend sends the request to the FastAPI backend.
3. The backend checks whether a previously generated guide exists in the database.
4. If a guide exists, the backend returns the cached guide.
5. If no guide exists, the research agent searches for relevant documentation using Tavily.
6. The research agent fetches available documentation and classifies sources.
7. Google Gemini processes the collected research and generates a structured OAuth guide.
8. Pydantic validates the generated guide against the expected schema.
9. The guide and research statistics are stored in the database.
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
│   ├── package.json
│   └── .env
│
├── .gitignore
└── README.md
```

## Installation and Local Setup

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

Replace `YOUR_GITHUB_REPOSITORY_URL` with the actual GitHub repository URL.

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

### 3. Configure Backend Environment Variables

Create a `.env` file inside the `backend` directory:

```env
GEMINI_API_KEY=your_gemini_api_key
TAVILY_API_KEY=your_tavily_api_key
GEMINI_MODEL=gemini-3.5-flash-lite
DATABASE_URL=sqlite:///./oauth_navigator.db
```

Replace the placeholder API credentials with your own values.

The SQLite connection is used for local development. Production uses the Neon PostgreSQL connection configured through the Render environment settings.

Never commit API keys, database credentials, or `.env` files to GitHub.

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

Health check:

```text
http://localhost:8000/health
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

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Start the development server:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## Database Configuration

OAuth Navigator uses different database configurations for local development and production.

| Environment | Database |
|---|---|
| Local development | SQLite |
| Production | Neon PostgreSQL |

SQLAlchemy manages database connections and ORM operations.

The application reads the database connection URL from the `DATABASE_URL` environment variable.

For production, configure the Neon PostgreSQL connection string in the Render environment settings. Do not store the production database password in the source code.

### Initial Integration Data

The backend includes a seed script for inserting the initial integration records.

Run it from the backend directory:

```bash
python seed.py
```

For production database seeding, provide the Neon connection through the `DATABASE_URL` environment variable without placing the connection string in the command history or source code.

The seed script checks existing integration slugs before inserting records, helping avoid duplicate entries.

## Production Deployment

The application is deployed using three services.

### 1. Frontend – Vercel

- Repository: GitHub
- Framework: Vite
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

Production environment variable:

```env
VITE_API_BASE_URL=https://oauth-navigator-backend.onrender.com
```

The frontend uses this variable to communicate with the deployed FastAPI backend.

Vite environment variables are included at build time, so a new frontend deployment is required after changing them.

### 2. Backend – Render

- Repository: GitHub
- Runtime: Python
- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

Configure the following environment variables in Render:

```env
GEMINI_API_KEY=your_gemini_api_key
TAVILY_API_KEY=your_tavily_api_key
GEMINI_MODEL=gemini-3.5-flash-lite
DATABASE_URL=your_neon_postgresql_connection_string
FRONTEND_URLS=http://localhost:5173,https://oauth-navigator.vercel.app
```

`FRONTEND_URLS` configures the backend's allowed CORS origins. Add other frontend origins only when they are needed.

### 3. Database – Neon PostgreSQL

Neon PostgreSQL provides the production database.

The backend connects to Neon through SQLAlchemy and the Psycopg PostgreSQL driver.

Database tables are created by the application's SQLAlchemy metadata initialization during backend startup.

The production database is independent of the local SQLite database. Local records are not automatically copied to Neon; initial integration records must be seeded into the production database separately.

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
- Database credentials are configured separately in the deployment environment.
- CORS is configured to allow the production frontend origin.
- Generated guides are validated using Pydantic.
- External documentation should be treated as untrusted input.
- Source classification should not be interpreted as independent verification of OAuth claims.
- Production deployment requires stronger URL validation and SSRF protections before accepting arbitrary user-supplied URLs.
- API keys and database credentials must never be committed to the public repository.

## Current Limitations

- The project demonstrates a selected set of integrations rather than a fully populated library of 100 applications.
- OAuth setup instructions depend on the availability and quality of external documentation.
- Source classification uses configured provider-domain mappings and does not independently prove domain ownership.
- Individual OAuth claims are not independently verified merely because a source was retrieved.
- Generated OAuth instructions are guidance, not proof that an OAuth application has been registered or an authorization flow has been successfully tested.
- Provider approval timelines may be unknown or variable.
- Arbitrary URL research requires additional SSRF and network security hardening before broader public use.
- Production deployment is operational, but additional monitoring, security hardening, and testing are needed.

## Future Enhancements

- Expand the integration library to support 100+ applications.
- Add claim-level evidence verification.
- Improve provider-domain discovery and classification.
- Introduce secure URL fetching with SSRF protection.
- Add guide refresh and version history.
- Improve source retrieval and document parsing.
- Add automated tests for research, caching, and API behaviour.
- Add monitoring, structured logging, and production error handling.
- Support more OAuth providers and integration scenarios.

## Project Objective

OAuth Navigator aims to reduce the research and configuration effort involved in integrating third-party applications with AI agents by providing structured, evidence-aware OAuth implementation guidance.

**Built with React, Vite, Tailwind CSS, FastAPI, SQLAlchemy, Google Gemini, Tavily, and Neon PostgreSQL.**

**Live Application:** https://oauth-navigator.vercel.app