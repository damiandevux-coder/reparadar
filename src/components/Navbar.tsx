"use client"

import Link from "next/link"

export function Navbar() {
  return (
    <nav className="border-b border-zinc-800 bg-zinc-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold text-white">
          📡 RepoRadar
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-zinc-400 hover:text-white"
          >
            Trending
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  )
}
