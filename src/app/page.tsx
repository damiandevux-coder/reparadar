import { Navbar } from "@/components/Navbar"
import { TrendingRepos } from "@/components/TrendingRepos"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      
      {/* Hero */}
      <section className="border-b border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight">
            Track What Matters in{" "}
            <span className="text-orange-500">Open Source</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-zinc-400">
            Monitor GitHub repositories, discover trending projects, and never miss
            the next big thing in tech.
          </p>
          {session ? (
            <a
              href="/dashboard"
              className="inline-block rounded-lg bg-orange-500 px-8 py-3 font-medium text-white hover:bg-orange-600"
            >
              Go to Dashboard
            </a>
          ) : (
            <p className="text-zinc-500">
              Sign in to create your watchlists
            </p>
          )}
        </div>
      </section>

      {/* Trending */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-2xl font-bold">🔥 Trending Now</h2>
          <TrendingRepos />
        </div>
      </section>
    </div>
  )
}
