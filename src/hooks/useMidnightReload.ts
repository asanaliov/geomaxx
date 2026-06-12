import { useEffect } from 'react'
import { msUntilNextUtcMidnight } from '../lib/time'

/**
 * Reloads the page at the next UTC midnight so a fresh daily puzzle loads for
 * players who leave the tab open across the date boundary.
 */
export function useMidnightReload(): void {
  useEffect(() => {
    const timer = setTimeout(
      () => window.location.reload(),
      msUntilNextUtcMidnight() + 1000,
    )
    return () => clearTimeout(timer)
  }, [])
}
