import { useEffect, useState } from 'react'

/**
 * Fetches live profile + repo data from the public GitHub API.
 * Falls back to the snapshot in portfolioData if the request fails or is rate-limited.
 */
export default function useGitHub(user, fallbackRepos) {
  const [profile, setProfile] = useState(null)
  const [repos, setRepos] = useState(fallbackRepos)
  const [live, setLive] = useState(false)

  useEffect(() => {
    let cancelled = false
    const wanted = new Set(fallbackRepos.map((r) => r.name.toLowerCase()))
    Promise.all([
      fetch(`https://api.github.com/users/${user}`).then((r) => (r.ok ? r.json() : null)),
      fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=updated`).then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([p, rs]) => {
        if (cancelled) return
        if (p) setProfile(p)
        if (Array.isArray(rs)) {
          const mapped = rs
            .filter((r) => wanted.has(r.name.toLowerCase()))
            .map((r) => {
              const fb = fallbackRepos.find((f) => f.name.toLowerCase() === r.name.toLowerCase())
              return {
                name: r.name,
                url: r.html_url,
                description: r.description || fb?.description || '',
                language: r.language || fb?.language,
                homepage: r.homepage || fb?.homepage || null,
                stars: r.stargazers_count,
                forks: r.forks_count,
                pushedAt: r.pushed_at,
              }
            })
          // keep the curated order
          mapped.sort((a, b) => fallbackRepos.findIndex((f) => f.name === a.name) - fallbackRepos.findIndex((f) => f.name === b.name))
          if (mapped.length) {
            setRepos(mapped)
            setLive(true)
          }
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [user, fallbackRepos])

  return { profile, repos, live }
}
