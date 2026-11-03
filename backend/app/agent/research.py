
import os
import httpx

from pathlib import Path
from urllib.parse import urldefrag, urlparse, urlunparse

from tavily import TavilyClient
from dotenv import load_dotenv
from bs4 import BeautifulSoup


# ==========================================
# ENVIRONMENT CONFIGURATION
# ==========================================

ENV_PATH = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=ENV_PATH)

TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")

if not TAVILY_API_KEY:
    raise ValueError(
        f"TAVILY_API_KEY is missing. Check your environment file: {ENV_PATH}"
    )

tavily_client = TavilyClient(api_key=TAVILY_API_KEY)


# ==========================================
# STEP 1: SEARCH OAUTH DOCUMENTATION
# ==========================================


def search_oauth_documentation(app_name: str) -> list[dict]:
    """
    Search for official OAuth documentation first,
    followed by supporting third-party documentation.
    """

    if not app_name or not app_name.strip():
        raise ValueError("Application name cannot be empty")

    provider_domains = {
        "asana": ["developers.asana.com", "forum.asana.com"],
        "slack": ["api.slack.com", "docs.slack.dev"],
        "notion": ["developers.notion.com"],
        "github": ["docs.github.com", "github.com"],
        "google drive": ["developers.google.com", "docs.cloud.google.com"],
    }

    provider = app_name.lower().strip()
    official_domains = provider_domains.get(provider, [])

    queries = []

    # Search official provider documentation first.
    if official_domains:
        queries.append({
            "query": (
                f"{app_name} OAuth 2.0 app registration "
                "redirect URI scopes client credentials"
            ),
            "domains": official_domains
        })

    # Search broadly for supporting documentation.
    queries.append({
        "query": (
            f"{app_name} OAuth 2.0 developer documentation "
            "registration setup"
        ),
        "domains": []
    })

    results = []
    seen_urls = set()

    try:
        for search in queries:
            search_args = {
                "query": search["query"],
                "search_depth": "advanced",
                "max_results": 5,
                "include_answer": False
            }

            if search["domains"]:
                search_args["include_domains"] = search["domains"]

            response = tavily_client.search(**search_args)

            for item in response.get("results", []):
                url = item.get("url")
                if not url:
                    continue
                # Remove fragments and normalize the URL.
                url, _ = urldefrag(url)
                parsed_url = urlparse(url)
                if parsed_url.scheme not in ("http", "https"):
                    continue
                if not parsed_url.hostname:
                    continue
                # Normalize hostname and remove default ports.
                normalized_url = urlunparse((
                    parsed_url.scheme.lower(),
                    parsed_url.netloc.lower(),
                    parsed_url.path.rstrip("/"),
                    parsed_url.params,
                    parsed_url.query,
                    ""
                    ))
                if normalized_url in seen_urls:
                    continue
                seen_urls.add(normalized_url)
                url = normalized_url

                if parsed_url.scheme not in ("http", "https"):
                    continue

                if not parsed_url.hostname:
                    continue

                seen_urls.add(url)

                results.append({
                    "title": item.get("title"),
                    "url": url,
                    "content": item.get("content"),
                    "score": item.get("score"),
                    "source_status": "unverified"
                })

        return results

    except Exception as error:
        raise RuntimeError(
            f"OAuth documentation search failed: {error}"
        ) from error

# ==========================================
# STEP 2: FETCH DOCUMENTATION
# ==========================================

def fetch_documentation(url: str) -> dict:
    """
    Fetch publicly accessible documentation and
    extract readable text from its HTML content.
    """

    parsed_url = urlparse(url)

    if parsed_url.scheme not in ("http", "https"):
        raise ValueError("Only HTTP and HTTPS URLs are allowed")

    if not parsed_url.hostname:
        raise ValueError("Invalid documentation URL")

    try:
        with httpx.Client(
            timeout=15.0,
            follow_redirects=True,
            headers={
                "User-Agent": "OAuthNavigator/1.0 (documentation research)"
            }
        ) as client:

            response = client.get(url)
            response.raise_for_status()

        soup = BeautifulSoup(
            response.text,
            "html.parser"
        )

        # Remove unnecessary HTML elements.
        for element in soup(
            ["script", "style", "nav", "footer", "header"]
        ):
            element.decompose()

        title = (
            soup.title.get_text(strip=True)
            if soup.title
            else "Untitled documentation"
        )

        content = soup.get_text(
            separator=" ",
            strip=True
        )

        return {
            "title": title,
            "url": str(response.url),
            "status_code": response.status_code,
            "content": content[:15000],
            "fetch_status": "success"
        }

    except httpx.HTTPError as error:
        return {
            "title": None,
            "url": url,
            "status_code": None,
            "content": None,
            "fetch_status": "failed",
            "error": str(error)
        }


# ==========================================
# STEP 3: CLASSIFY DOCUMENTATION SOURCES
# ==========================================


def classify_source(url: str, app_name: str) -> str:
    """
    Classify sources using known provider-owned domains.

    Domain ownership is a heuristic and does not prove
    that individual claims are authoritative.
    """

    hostname = (urlparse(url).hostname or "").lower().rstrip(".")

    if not hostname:
        return "unverified"

    provider_domains = {
        "asana": {
            "official": [
                "developers.asana.com",
                "asana.com"
            ],
            "community": [
                "forum.asana.com"
            ]
        },
        "slack": {
            "official": [
                "api.slack.com",
                "docs.slack.dev",
                "slack.com"
            ],
            "community": []
        },
        "notion": {
            "official": [
                "developers.notion.com",
                "notion.so",
                "notion.com"
            ],
            "community": []
        },
        "github": {
            "official": [
                "docs.github.com",
                "github.com"
            ],
            "community": [
                "github.community"
            ]
        },
        "google drive": {
            "official": [
                "developers.google.com",
                "docs.cloud.google.com",
                "accounts.google.com",
                "google.com"
            ],
            "community": [
                "groups.google.com"
            ]
        }
    }

    provider = app_name.lower().strip()
    domains = provider_domains.get(provider)

    if not domains:
        return "unverified"

    def matches_domain(domain_list):
        return any(
            hostname == domain or hostname.endswith("." + domain)
            for domain in domain_list
        )

    if matches_domain(domains["community"]):
        return "official_community"

    if matches_domain(domains["official"]):
        return "official"

    return "third_party"


# ==========================================
# STEP 4: RESEARCH AN APPLICATION
# ==========================================


def research_application(app_name: str) -> dict:
    """
    Search for OAuth documentation, fetch pages,
    classify sources, and calculate source statistics.

    Unverified sources are counted separately rather
    than being incorrectly classified as third-party.
    """

    search_results = search_oauth_documentation(app_name)

    documents = []

    for result in search_results:
        document = fetch_documentation(result["url"])

        source_type = classify_source(
            result["url"],
            app_name
        )

        documents.append({
            **result,
            "source_type": source_type,
            "document": document
        })

    successful_documents = [
        doc for doc in documents
        if doc["document"].get("fetch_status") == "success"
    ]

    return {
        "application": app_name,

        "total_sources_found": len(documents),

        "total_documents_fetched": len(successful_documents),

        "official_sources": sum(
            1 for doc in documents
            if doc["source_type"] == "official"
        ),

        "community_sources": sum(
            1 for doc in documents
            if doc["source_type"] == "official_community"
        ),

        "third_party_sources": sum(
            1 for doc in documents
            if doc["source_type"] == "third_party"
        ),

        "unverified_sources": sum(
            1 for doc in documents
            if doc["source_type"] == "unverified"
        ),

        "sources": documents
    }