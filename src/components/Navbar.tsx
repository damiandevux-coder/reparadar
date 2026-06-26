"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import Link from "next/link"

export function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold text-white">
          📡 RepoRadar
        </Link>
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <span className="text-sm text-zinc-400">
                {session.user?.name}
              </span>
              <button
                onClick={() => signOut()}
                className="rounded-lg bg-zinc-800 px-4 py-2 text-sm text-white hover:bg-zinc-700"
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn("github")}
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
            >
              Sign in with GitHub
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
