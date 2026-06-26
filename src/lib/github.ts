export interface Repo {
  id: string
  fullName: string
  description: string | null
  stars: number
  language: string | null
  url: string
}

export interface TrendingFilters {
  language?: string
  minStars?: number
  sort?: 'stars' | 'updated' | 'forks'
  period?: 'daily' | 'weekly' | 'monthly'
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Rust: '#dea584',
  Go: '#00ADD8',
  Java: '#b07219',
  'C++': '#f34b7d',
  Ruby: '#701516',
  Shell: '#89e051',
  Vue: '#41b883',
  HTML: '#e34c26',
  CSS: '#563d7c',
}

export function getLanguageColor(lang: string | null): string {
  if (!lang) return '#8b949e'
  return LANGUAGE_COLORS[lang] || '#8b949e'
}

export async function fetchTrendingRepos(filters?: TrendingFilters): Promise<Repo[]> {
  const perPage = 24
  let query = 'stars:>1000'

  if (filters?.language && filters.language !== 'all') {
    query += `+language:${filters.language}`
  }

  if (filters?.minStars) {
    query += `+stars:>=${filters.minStars}`
  }

  // Date filter based on period
  const now = new Date()
  if (filters?.period === 'daily') {
    const yesterday = new Date(now.getTime() - 86400000)
    query += `+pushed:>${yesterday.toISOString().split('T')[0]}`
  } else if (filters?.period === 'weekly') {
    const lastWeek = new Date(now.getTime() - 7 * 86400000)
    query += `+pushed:>${lastWeek.toISOString().split('T')[0]}`
  } else if (filters?.period === 'monthly') {
    const lastMonth = new Date(now.getTime() - 30 * 86400000)
    query += `+pushed:>${lastMonth.toISOString().split('T')[0]}`
  }

  const sort = filters?.sort || 'stars'

  try {
    const res = await fetch(
      `https://api.github.com/search/repositories?q=${query}&sort=${sort}&order=desc&per_page=${perPage}`,
      {
        headers: {
          'User-Agent': 'RepoRadar/1.0',
          Accept: 'application/vnd.github.v3+json',
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
  } catch {
    return []
  }
}

export async function searchRepos(query: string): Promise<Repo[]> {
  if (query.length < 2) return []
  try {
    const res = await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=8`,
      {
        headers: {
          'User-Agent': 'RepoRadar/1.0',
          Accept: 'application/vnd.github.v3+json',
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
  } catch {
    return []
  }
}
