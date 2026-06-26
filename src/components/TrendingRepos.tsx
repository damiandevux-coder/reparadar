"use client"

import { Repo } from "@/lib/github"

export function TrendingRepos({ repos }: { repos: Repo[] }) {
  if (repos.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center">
        <p className="text-zinc-400">No trending repos found.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {repos.map((repo) => (
        <a
          key={repo.id}
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-all hover:border-orange-500/50 hover:bg-zinc-800"
        >
          <div className="mb-2 flex items-start justify-between">
            <h3 className="font-semibold text-white group-hover:text-orange-400">
              {repo.fullName}
            </h3>
            <span className="flex items-center gap-1 text-sm text-yellow-400">
              ⭐ {repo.stars.toLocaleString()}
            </span>
          </div>
          <p className="mb-3 line-clamp-2 text-sm text-zinc-400">
            {repo.description || "No description"}
          </p>
          {repo.language && (
            <span className="inline-block rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">
              {repo.language}
            </span>
          )}
        </a>
      ))}
    </div>
  )
}
