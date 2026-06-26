import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get("q")

  if (!query || query.length < 2) {
    return NextResponse.json({ items: [] })
  }

  try {
    const res = await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=8`,
      {
        headers: {
          "User-Agent": "RepoRadar/1.0",
          Accept: "application/vnd.github.v3+json",
        },
      }
    )

    if (!res.ok) {
      return NextResponse.json({ items: [] })
    }

    const data = await res.json()
    const repos = (data.items || []).map((r: any) => ({
      id: String(r.id),
      fullName: r.full_name,
      description: r.description,
      stars: r.stargazers_count,
      language: r.language,
      url: r.html_url,
    }))

    return NextResponse.json({ items: repos })
  } catch {
    return NextResponse.json({ items: [] })
  }
}
