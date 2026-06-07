import { useEffect } from 'react'

/**
 * Reloads the page at the next UTC midnight so a fresh daily puzzle loads for
 * players who leave the tab open across the date boundary.
 */
export function useMidnightReload(): void {
  useEffect(() => {
    const now = new Date()
    const nextMidnightUtc = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
    )
    const msUntil = nextMidnightUtc - now.getTime() + 1000
    const timer = setTimeout(() => window.location.reload(), msUntil)
    return () => clearTimeout(timer)
  }, [])
}
