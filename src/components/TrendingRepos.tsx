"use client"

import { useEffect, useState, useCallback } from "react"
import { fetchTrendingRepos, Repo, TrendingFilters, getLanguageColor } from "@/lib/github"

const LANGUAGES = ['all', 'TypeScript', 'JavaScript', 'Python', 'Rust', 'Go', 'Java']

export function TrendingRepos() {
  const [repos, setRepos] = useState<Repo[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<TrendingFilters>({
    language: 'all',
    sort: 'stars',
    period: 'daily',
  })

  const loadRepos = useCallback(async () => {
    setLoading(true)
    const data = await fetchTrendingRepos(filters)
    setRepos(data)
    setLoading(false)
  }, [filters])

  useEffect(() => {
    loadRepos()
  }, [loadRepos])

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        {/* Language filter */}
        <div className="flex gap-1 overflow-x-auto pb-1">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => setFilters({ ...filters, language: lang })}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                filters.language === lang
                  ? 'bg-orange-500 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
              }`}
            >
              {lang === 'all' ? 'All' : lang}
            </button>
          ))}
        </div>

        {/* Period filter */}
        <div className="flex gap-1">
          {(['daily', 'weekly', 'monthly'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setFilters({ ...filters, period })}
              className={`rounded-lg px-3 py-1 text-sm capitalize transition-colors ${
                filters.period === period
                  ? 'bg-zinc-700 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {period}
            </button>
          ))}
        </div>

        {/* Refresh */}
        <button
          onClick={loadRepos}
          disabled={loading}
          className="ml-auto rounded-lg bg-zinc-800 px-3 py-1 text-sm text-zinc-400 hover:bg-zinc-700 disabled:opacity-50"
        >
          {loading ? '⟳' : '↻'} Refresh
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-36 animate-pulse rounded-xl bg-zinc-900" />
          ))}
        </div>
      ) : repos.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center">
          <p className="text-zinc-400">No repos found for these filters.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {repos.map((repo) => (
            <a
              key={repo.id}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-all hover:border-orange-500/50 hover:bg-zinc-800"
            >
              <div className="mb-2 flex items-start justify-between">
                <h3 className="line-clamp-1 font-semibold text-white group-hover:text-orange-400">
                  {repo.fullName}
                </h3>
                <span className="flex shrink-0 items-center gap-1 text-sm text-yellow-400">
                  ⭐ {repo.stars.toLocaleString()}
                </span>
              </div>
              <p className="mb-3 line-clamp-2 flex-1 text-sm text-zinc-400">
                {repo.description || "No description"}
              </p>
              <div className="flex items-center gap-2">
                {repo.language && (
                  <span
                    className="inline-flex items-center gap-1 rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300"
                  >
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: getLanguageColor(repo.language) }}
                    />
                    {repo.language}
                  </span>
                )}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
