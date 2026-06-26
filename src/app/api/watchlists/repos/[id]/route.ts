import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = db.getOrCreateUser({
    email: session.user.email,
    name: session.user.name || null,
    image: session.user.image || null,
  })

  const watchlists = db.getWatchlists(user.id)
  const { id } = await params

  db.removeRepoFromWatchlist(
    watchlists.map((w) => w.id),
    id
  )

  return NextResponse.json({ success: true })
}
