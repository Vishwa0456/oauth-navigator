import { useState, useEffect } from 'react'
import { getIntegrations } from './services/api'

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

function App() {
  const [search, setSearch] = useState('')
  const [integrations, setIntegrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
          <button className="p-2 rounded-lg hover:bg-slate-100">
            <Bell size={20} />
          </button>

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

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold">
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
              subtitle="Ready-to-use guides"
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
          <section className="bg-slate-900 rounded-2xl p-7 text-white mb-10">

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
              Enter an application name or website. Our research agent
              will investigate its OAuth requirements and generate a
              step-by-step integration guide.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 max-w-3xl">

              <div className="flex-1 bg-white rounded-xl flex items-center px-4">
                <Globe className="text-slate-400" size={19} />

                <input
                  placeholder="Enter app name or website..."
                  className="w-full p-3 outline-none text-slate-900"
                />
              </div>

              <button className="bg-blue-600 hover:bg-blue-700 rounded-xl px-6 py-3 font-semibold flex items-center justify-center gap-2">
                <Sparkles size={17} />
                Research app
              </button>

            </div>
          </section>

          {/* Application Directory */}
          <section>

            <div className="flex flex-wrap justify-between items-center gap-3 mb-6">

              <div>
                <h3 className="text-xl font-bold">
                  OAuth App Directory
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Explore available integration guides.
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

                  <button className="w-full mt-5 border border-slate-200 rounded-lg py-2.5 text-sm font-semibold hover:bg-slate-50 flex items-center justify-center gap-2">
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
