import fs from "fs"
import path from "path"

const DB_PATH = path.join(process.cwd(), "data", "db.json")

interface DB {
  users: User[]
  repos: Repo[]
  watchlists: Watchlist[]
  watchlistRepos: WatchlistRepo[]
}

interface User {
  id: string
  email: string
  name: string | null
  image: string | null
}

interface Repo {
  id: string
  githubId: string
  fullName: string
  description: string | null
  language: string | null
  stars: number
  url: string
}

interface Watchlist {
  id: string
  name: string
  userId: string
}

interface WatchlistRepo {
  id: string
  watchlistId: string
  repoId: string
}

function ensureDb(): DB {
  const dir = path.dirname(DB_PATH)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  if (!fs.existsSync(DB_PATH)) {
    const empty: DB = { users: [], repos: [], watchlists: [], watchlistRepos: [] }
    fs.writeFileSync(DB_PATH, JSON.stringify(empty, null, 2))
    return empty
  }
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"))
}

function saveDb(db: DB) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2))
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

export const db = {
  getUserByEmail(email: string): User | undefined {
    return ensureDb().users.find((u) => u.email === email)
  },

  createUser(data: { email: string; name: string | null; image: string | null }): User {
    const db = ensureDb()
    const user: User = { id: generateId(), ...data }
    db.users.push(user)
    saveDb(db)
    return user
  },

  getOrCreateUser(data: { email: string; name: string | null; image: string | null }): User {
    return this.getUserByEmail(data.email) || this.createUser(data)
  },

  getWatchlists(userId: string): (Watchlist & { repos: Repo[] })[] {
    const db = ensureDb()
    return db.watchlists
      .filter((w) => w.userId === userId)
      .map((w) => ({
        ...w,
        repos: db.watchlistRepos
          .filter((wr) => wr.watchlistId === w.id)
          .map((wr) => db.repos.find((r) => r.id === wr.repoId)!)
          .filter(Boolean),
      }))
  },

  getOrCreateWatchlist(userId: string): Watchlist {
    const db = ensureDb()
    let wl = db.watchlists.find((w) => w.userId === userId)
    if (!wl) {
      wl = { id: generateId(), name: "My Watchlist", userId }
      db.watchlists.push(wl)
      saveDb(db)
    }
    return wl
  },

  upsertRepo(data: {
    githubId: string
    fullName: string
    description: string | null
    stars: number
    language: string | null
    url: string
  }): Repo {
    const db = ensureDb()
    let repo = db.repos.find((r) => r.githubId === data.githubId)
    if (repo) {
      Object.assign(repo, data)
    } else {
      repo = { id: generateId(), ...data }
      db.repos.push(repo)
    }
    saveDb(db)
    return repo
  },

  addRepoToWatchlist(watchlistId: string, repoId: string): void {
    const db = ensureDb()
    const exists = db.watchlistRepos.some(
      (wr) => wr.watchlistId === watchlistId && wr.repoId === repoId
    )
    if (!exists) {
      db.watchlistRepos.push({ id: generateId(), watchlistId, repoId })
      saveDb(db)
    }
  },

  removeRepoFromWatchlist(watchlistIds: string[], repoId: string): void {
    const db = ensureDb()
    db.watchlistRepos = db.watchlistRepos.filter(
      (wr) => !(watchlistIds.includes(wr.watchlistId) && wr.repoId === repoId)
    )
    saveDb(db)
  },
}
