export interface Repo {
  id: string
  fullName: string
  description: string | null
  stars: number
  language: string | null
  url: string
}

export async function fetchTrendingRepos(): Promise<Repo[]> {
  const res = await fetch(
    "https://api.github.com/search/repositories?q=created:%3E2025-01-01+stars:%3E1000&sort=stars&order=desc&per_page=12",
    {
      headers: {
        "User-Agent": "RepoRadar/1.0",
        Accept: "application/vnd.github.v3+json",
      },
    }
  )
  if (!res.ok) return []
  const data = await res.json()
  return (data.items || []).map((r: any) => ({
    id: String(r.id),
    fullName: r.full_name,
    description: r.description,
    stars: r.stargazers_count,
    language: r.language,
    url: r.html_url,
  }))
}

export async function searchRepos(query: string): Promise<Repo[]> {
  if (query.length < 2) return []
  const res = await fetch(
    `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=8`,
    {
      headers: {
        "User-Agent": "RepoRadar/1.0",
        Accept: "application/vnd.github.v3+json",
      },
    }
  )
  if (!res.ok) return []
  const data = await res.json()
  return (data.items || []).map((r: any) => ({
    id: String(r.id),
    fullName: r.full_name,
    description: r.description,
    stars: r.stargazers_count,
    language: r.language,
    url: r.html_url,
  }))
}
