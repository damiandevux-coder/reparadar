"use client"

import { useEffect, useState } from "react"

interface Repo {
  id: string
  fullName: string
  description: string
  stars: number
  language: string
  url: string
}

interface Watchlist {
  id: string
  name: string
  repos: Repo[]
}

export function WatchlistManager() {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([])
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState<Repo[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch("/api/watchlists")
      .then((r) => r.json())
      .then((data) => setWatchlists(data.watchlists || []))
  }, [])

  const handleSearch = async (q: string) => {
    setSearch(q)
    if (q.length < 2) {
      setSearchResults([])
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/repos/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setSearchResults(data.repos || [])
    } catch {
      setSearchResults([])
    }
    setLoading(false)
  }

  const addRepo = async (repo: Repo) => {
    await fetch("/api/watchlists/repos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repo }),
    })
    // Refresh
    const res = await fetch("/api/watchlists")
    const data = await res.json()
    setWatchlists(data.watchlists || [])
    setSearch("")
    setSearchResults([])
  }

  const removeRepo = async (repoId: string) => {
    await fetch(`/api/watchlists/repos/${repoId}`, { method: "DELETE" })
    const res = await fetch("/api/watchlists")
    const data = await res.json()
    setWatchlists(data.watchlists || [])
  }

  return (
    <div className="space-y-8">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search GitHub repos..."
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
        />
        {searchResults.length > 0 && (
          <div className="absolute z-10 mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-900 shadow-xl">
            {searchResults.map((repo) => (
              <div
                key={repo.id}
                className="flex items-center justify-between border-b border-zinc-800 px-4 py-3 last:border-0 hover:bg-zinc-800"
              >
                <div>
                  <p className="font-medium text-white">{repo.fullName}</p>
                  <p className="text-sm text-zinc-400">
                    ⭐ {repo.stars.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => addRepo(repo)}
                  className="rounded bg-orange-500 px-3 py-1 text-sm text-white hover:bg-orange-600"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Watchlists */}
      {watchlists.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center">
          <p className="text-zinc-400">No repos in your watchlist yet.</p>
          <p className="mt-2 text-sm text-zinc-500">
            Search above to add repos!
          </p>
        </div>
      ) : (
        watchlists.map((wl) => (
          <div key={wl.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="mb-4 text-xl font-semibold">{wl.name}</h2>
            <div className="space-y-3">
              {wl.repos.map((repo) => (
                <div
                  key={repo.id}
                  className="flex items-center justify-between rounded-lg bg-zinc-950 p-4"
                >
                  <div>
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-white hover:text-orange-400"
                    >
                      {repo.fullName}
                    </a>
                    <p className="mt-1 text-sm text-zinc-400">
                      {repo.description}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-zinc-500">
                      <span>⭐ {repo.stars.toLocaleString()}</span>
                      {repo.language && <span>● {repo.language}</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => removeRepo(repo.id)}
                    className="rounded bg-zinc-800 px-3 py-1 text-sm text-zinc-400 hover:bg-red-900/50 hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
