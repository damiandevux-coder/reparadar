import { NextResponse } from "next/server"

export async function GET() {
  try {
    const res = await fetch(
      "https://api.github.com/search/repositories?q=created:%3E2025-01-01+stars:%3E1000&sort=stars&order=desc&per_page=12",
      {
        headers: {
          "User-Agent": "RepoRadar/1.0",
          Accept: "application/vnd.github.v3+json",
        },
        next: { revalidate: 3600 },
      }
    )

    if (!res.ok) {
      return NextResponse.json({ repos: [] })
    }

    const data = await res.json()
    const repos = (data.items || []).map((r: any) => ({
      id: r.id,
      fullName: r.full_name,
      description: r.description,
      stars: r.stargazers_count,
      language: r.language,
      url: r.html_url,
    }))

    return NextResponse.json({ repos })
  } catch {
    return NextResponse.json({ repos: [] })
  }
}
