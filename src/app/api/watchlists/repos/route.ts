import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = db.getOrCreateUser({
    email: session.user.email,
    name: session.user.name || null,
    image: session.user.image || null,
  })

  const watchlist = db.getOrCreateWatchlist(user.id)
  const { repo } = await req.json()

  const dbRepo = db.upsertRepo({
    githubId: String(repo.id),
    fullName: repo.fullName,
    description: repo.description,
    stars: repo.stars,
    language: repo.language,
    url: repo.url,
  })

  db.addRepoToWatchlist(watchlist.id, dbRepo.id)

  return NextResponse.json({ success: true })
}
