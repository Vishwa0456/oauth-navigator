import { useState, useEffect } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom'

import {
  getIntegrations,
  generateOAuthGuide,
  getOAuthGuide,
} from './services/api'

import {
  AppWindow,
  Sparkles,
  Search,
  Bell,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  Globe,
  Zap,
  ArrowLeft,
  ExternalLink,
  LoaderCircle,
} from 'lucide-react'

// Styling for integration icons
const integrationStyles = {
  'google-drive': {
    color: '#4285F4',
    icon: 'G',
  },
  slack: {
    color: '#611f69',
    icon: 'S',
  },
  notion: {
    color: '#171717',
    icon: 'N',
  },
  github: {
    color: '#24292f',
    icon: 'G',
  },
}

// Main application
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/guides/:slug" element={<GuidePage />} />
      </Routes>
    </BrowserRouter>
  )
}

// Dashboard
function Dashboard() {
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [researchInput, setResearchInput] = useState('')
  const [integrations, setIntegrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [researching, setResearching] = useState(false)
  const [error, setError] = useState('')
  const [researchError, setResearchError] = useState('')

  // Fetch integrations from FastAPI backend
  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        const data = await getIntegrations()
        setIntegrations(data)
      } catch (err) {
        console.error('Failed to fetch integrations:', err)
        setError(
          'Unable to load integrations. Please check whether the backend is running.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchIntegrations()
  }, [])

  // Generate or retrieve an OAuth guide
  const handleResearch = async (applicationName) => {
    const appName = applicationName.trim()

    if (!appName) {
      setResearchError('Please enter an application name.')
      return
    }

    try {
      setResearching(true)
      setResearchError('')

      const response = await generateOAuthGuide(appName)

      if (!response.slug) {
        throw new Error('The backend did not return a guide URL.')
      }

      navigate(`/guides/${response.slug}`)
    } catch (err) {
      console.error('OAuth research failed:', err)

      const detail = err.response?.data?.detail

      setResearchError(
        typeof detail === 'string'
          ? detail
          : 'Unable to generate the OAuth guide. Please try again.'
      )
    } finally {
      setResearching(false)
    }
  }

  // Filter integrations based on search input
  const filteredApps = integrations.filter((app) =>
    app.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center">

        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl text-white">
            <ShieldCheck size={23} />
          </div>

          <div>
            <h1 className="font-bold text-lg">OAuth Navigator</h1>
            <p className="text-xs text-slate-500">
              OAuth integration workspace
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            V
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full min-w-0">

        <div className="p-8 max-w-7xl mx-auto">

          {/* Welcome Section */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">

            <div>
              <h2 className="text-2xl font-bold">
                Welcome to OAuth Navigator
              </h2>

              <p className="text-slate-500 mt-1">
                Discover, understand and configure OAuth integrations.
              </p>
            </div>

            <button
              onClick={() =>
                document.getElementById('research-input')?.focus()
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold"
            >
              <Sparkles size={17} />
              Generate a guide
            </button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">

            <StatCard
              title="Available integrations"
              value={
                loading
                  ? '...'
                  : String(integrations.length).padStart(2, '0')
              }
              subtitle="Ready-to-use integrations"
              icon={<AppWindow />}
            />

            <StatCard
              title="AI research agent"
              value="Active"
              subtitle="Generate guides for new apps"
              icon={<Sparkles />}
            />

            <StatCard
              title="Documentation"
              value="Evidence-based"
              subtitle="Provider sources and guidance"
              icon={<ShieldCheck />}
            />

          </div>

          {/* AI Research Section */}
          <section
            id="research-section"
            className="bg-slate-900 rounded-2xl p-7 text-white mb-10"
          >

            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="text-blue-400" size={22} />

              <span className="text-sm font-semibold text-blue-300">
                AI POWERED RESEARCH
              </span>
            </div>

            <h3 className="text-2xl font-bold mb-2">
              Looking for an application?
            </h3>

            <p className="text-slate-300 mb-6 max-w-2xl text-sm">
              Enter an application name. Our research agent will
              investigate its OAuth requirements and generate a
              step-by-step integration guide.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleResearch(researchInput)
              }}
              className="flex flex-col sm:flex-row gap-3 max-w-3xl"
            >

              <div className="flex-1 bg-white rounded-xl flex items-center px-4">
                <Globe className="text-slate-400" size={19} />

                <input
                  id="research-input"
                  value={researchInput}
                  onChange={(e) => setResearchInput(e.target.value)}
                  placeholder="Enter application name..."
                  disabled={researching}
                  className="w-full p-3 outline-none text-slate-900"
                />
              </div>

              <button
                type="submit"
                disabled={researching || !researchInput.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed rounded-xl px-6 py-3 font-semibold flex items-center justify-center gap-2"
              >
                {researching ? (
                  <>
                    <LoaderCircle size={17} className="animate-spin" />
                    Researching...
                  </>
                ) : (
                  <>
                    <Sparkles size={17} />
                    Research app
                  </>
                )}
              </button>

            </form>

            {researching && (
              <p className="text-blue-300 text-sm mt-4">
                Researching provider documentation and generating your guide.
                This may take a little time.
              </p>
            )}

            {researchError && (
              <p className="text-red-300 text-sm mt-4">
                {researchError}
              </p>
            )}

          </section>

          {/* Application Directory */}
          <section>

            <div className="flex flex-wrap justify-between items-center gap-3 mb-6">

              <div>
                <h3 className="text-xl font-bold">
                  OAuth App Directory
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Explore available integrations.
                </p>
              </div>

              <span className="text-sm text-slate-500">
                {loading
                  ? 'Loading...'
                  : `${filteredApps.length} integrations`}
              </span>

            </div>

            {/* Search */}
            <div className="relative mb-6 max-w-md">

              <Search
                className="absolute left-3 top-3 text-slate-400"
                size={19}
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search integrations..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500"
              />

            </div>

            {/* Integration Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

              {/* Loading State */}
              {loading && (
                <p className="text-slate-500 col-span-full py-8">
                  Loading integrations...
                </p>
              )}

              {/* Error State */}
              {error && (
                <p className="text-red-600 col-span-full py-8">
                  {error}
                </p>
              )}

              {/* Integration Results */}
              {!loading && !error && filteredApps.map((app) => (

                <div
                  key={app.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition"
                >

                  <div className="flex justify-between items-start mb-5">

                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold"
                      style={{
                        backgroundColor:
                          integrationStyles[app.slug]?.color || '#2563eb',
                      }}
                    >
                      {integrationStyles[app.slug]?.icon || app.name.charAt(0)}
                    </div>

                    <ArrowUpRight
                      size={19}
                      className="text-slate-400"
                    />

                  </div>

                  <h4 className="font-bold text-lg">
                    {app.name}
                  </h4>

                  <p className="text-xs text-slate-400 mb-3">
                    {app.category}
                  </p>

                  <p className="text-sm text-slate-600 leading-relaxed mb-5">
                    {app.description}
                  </p>

                  <div className="flex justify-between items-center border-t pt-4 text-xs">

                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                      {app.auth_type}
                    </span>

                    <a
                      href={app.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-blue-600"
                    >
                      Official website
                    </a>

                  </div>

                  <button
                    onClick={() => handleResearch(app.name)}
                    disabled={researching}
                    className="w-full mt-5 border border-slate-200 rounded-lg py-2.5 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    View integration guide
                    <ChevronRight size={16} />
                  </button>

                </div>

              ))}

              {/* Empty Search Result */}
              {!loading && !error && filteredApps.length === 0 && (
                <p className="text-slate-500 col-span-full py-8">
                  No integrations found. Try another application.
                </p>
              )}

            </div>
          </section>

          {/* Footer */}
          <footer className="mt-12 border-t pt-6 text-sm text-slate-400 flex justify-between">

            <span>OAuth Navigator © 2026</span>

            <span className="flex items-center gap-1">
              <Zap size={14} />
              Powered by AI research
            </span>

          </footer>

        </div>
      </main>
    </div>
  )
}

// Guide Details Page
function GuidePage() {
  const { slug } = useParams()
  const navigate = useNavigate()

  const [guideData, setGuideData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Retrieve saved guide from backend
  useEffect(() => {
    const fetchGuide = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await getOAuthGuide(slug)
        setGuideData(data)
      } catch (err) {
        console.error('Failed to retrieve OAuth guide:', err)

        setError(
          err.response?.data?.detail ||
          'Unable to retrieve this OAuth guide.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchGuide()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-600">
          <LoaderCircle className="animate-spin" />
          Loading OAuth guide...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 border">
          <h2 className="text-xl font-bold text-red-600 mb-3">
            Guide not available
          </h2>

          <p className="text-slate-600 mb-6">{error}</p>

          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    )
  }

  const guide = guideData?.guide || {}

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">

          <Link to="/" className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white">
              <ShieldCheck size={23} />
            </div>

            <div>
              <h1 className="font-bold text-lg">OAuth Navigator</h1>
              <p className="text-xs text-slate-500">
                OAuth integration workspace
              </p>
            </div>
          </Link>

          <button
            onClick={() => navigate('/')}
            className="text-sm text-slate-600 hover:text-blue-600 flex items-center gap-2"
          >
            <ArrowLeft size={17} />
            Dashboard
          </button>

        </div>
      </header>

      {/* Guide Content */}
      <main className="max-w-5xl mx-auto p-6 md:p-8">

        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600 mb-2">
            OAUTH INTEGRATION GUIDE
          </p>

          <h2 className="text-3xl font-bold mb-3">
            {guideData.application_name}
          </h2>

          <p className="text-slate-500">
            AI-generated OAuth integration research and setup instructions.
          </p>
        </div>

        {/* Research Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

          <StatCard
            title="Total sources"
            value={guideData.total_sources ?? 0}
            subtitle="Research results"
            icon={<Globe />}
          />

          <StatCard
            title="Official sources"
            value={guideData.official_sources ?? 0}
            subtitle="Provider documentation"
            icon={<ShieldCheck />}
          />

          <StatCard
            title="Community sources"
            value={guideData.community_sources ?? 0}
            subtitle="Community discussions"
            icon={<AppWindow />}
          />

          <StatCard
            title="Third-party sources"
            value={guideData.third_party_sources ?? 0}
            subtitle="External documentation"
            icon={<ExternalLink />}
          />

        </div>

        {/* Guide Information */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8">

          <div className="flex flex-wrap justify-between items-center gap-3 mb-6 pb-5 border-b">
            <h3 className="text-xl font-bold">
              Integration Instructions
            </h3>

            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
              {guideData.status}
            </span>
          </div>

          <GuideRenderer data={guide} />

        </section>

        {/* Shareable URL */}
        <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-5">
          <h3 className="font-semibold text-blue-900 mb-2">
            Share this guide
          </h3>

          <p className="text-sm text-blue-800 break-all">
            {window.location.href}
          </p>

          <button
            onClick={() =>
              navigator.clipboard.writeText(window.location.href)
            }
            className="mt-3 text-sm font-semibold text-blue-700 hover:text-blue-900"
          >
            Copy guide URL
          </button>
        </div>

        <footer className="mt-10 border-t pt-6 text-sm text-slate-400">
          OAuth Navigator © 2026
        </footer>

      </main>
    </div>
  )
}

// Flexible renderer for the structured Gemini guide
function GuideRenderer({ data }) {
  if (!data || typeof data !== 'object') {
    return (
      <p className="text-slate-500">
        No guide information is available.
      </p>
    )
  }

  return (
    <div className="space-y-6">
      {Object.entries(data).map(([key, value]) => {
        if (
          value === null ||
          value === undefined ||
          key.toLowerCase() === 'content'
        ) {
          return null
        }

        return (
          <div key={key}>
            <h4 className="font-bold text-slate-800 mb-3">
              {formatLabel(key)}
            </h4>

            <GuideValue value={value} />
          </div>
        )
      })}
    </div>
  )
}

// Render strings, arrays, objects and source URLs
function GuideValue({ value }) {
  if (value === null || value === undefined) {
    return null
  }

  if (typeof value === 'boolean') {
    return (
      <p className="text-slate-600">
        {value ? 'Yes' : 'No'}
      </p>
    )
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const text = String(value)

    if (/^https?:\/\//i.test(text)) {
      return (
        <a
          href={text}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline break-all inline-flex items-center gap-1"
        >
          {text}
          <ExternalLink size={14} />
        </a>
      )
    }

    return (
      <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
        {text}
      </p>
    )
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return (
        <p className="text-slate-400 text-sm">
          No information available.
        </p>
      )
    }

    return (
      <div className="space-y-3">
        {value.map((item, index) => (
          <div
            key={index}
            className="bg-slate-50 border border-slate-100 rounded-xl p-4"
          >
            {typeof item === 'object' && item !== null ? (
              <GuideRenderer data={item} />
            ) : (
              <div className="flex gap-3">
                <span className="text-blue-600 font-bold">
                  {index + 1}.
                </span>
                <div className="flex-1">
                  <GuideValue value={item} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  if (typeof value === 'object') {
    return (
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
        <GuideRenderer data={value} />
      </div>
    )
  }

  return null
}

// Convert field names into readable headings
function formatLabel(value) {
  return value
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

// Dashboard Statistics Component
function StatCard({ title, value, subtitle, icon }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">

      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-slate-500">
          {title}
        </p>

        <span className="text-blue-600">
          {icon}
        </span>
      </div>

      <h3 className="text-2xl font-bold">
        {value}
      </h3>

      <p className="text-xs text-slate-400 mt-2">
        {subtitle}
      </p>

    </div>
  )
}

export default App
