import { Navbar } from "@/components/Navbar"
import { WatchlistManager } from "@/components/WatchlistManager"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Your Dashboard</h1>
          <p className="mt-2 text-zinc-400">
            Track your favorite repos and discover new ones.
          </p>
        </div>
        <WatchlistManager />
      </div>
    </div>
  )
}
