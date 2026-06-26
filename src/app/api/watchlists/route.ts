import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ watchlists: [] })
  }

  const user = db.getOrCreateUser({
    email: session.user.email,
    name: session.user.name || null,
    image: session.user.image || null,
  })

  const watchlists = db.getWatchlists(user.id)

  return NextResponse.json({
    watchlists: watchlists.map((wl) => ({
      id: wl.id,
      name: wl.name,
      repos: wl.repos.map((r) => ({
        id: r.id,
        fullName: r.fullName,
        description: r.description,
        stars: r.stars,
        language: r.language,
        url: r.url,
      })),
    })),
  })
}
