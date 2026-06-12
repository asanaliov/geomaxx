import { useEffect, useState } from 'react'
import { formatCountdown, msUntilNextUtcMidnight } from '../lib/time'

/**
 * Live HH:MM:SS countdown to the next daily puzzle (UTC midnight).
 * The label is recomputed on every render; while `active` is true an interval
 * forces a re-render each second to keep it ticking.
 */
export function useCountdown(active: boolean): string {
  const [, setTick] = useState(0)

  useEffect(() => {
    if (!active) return
    const timer = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(timer)
  }, [active])

  return formatCountdown(msUntilNextUtcMidnight())
}
