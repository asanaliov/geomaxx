/** Milliseconds from `now` until the next UTC midnight (next daily puzzle). */
export const msUntilNextUtcMidnight = (now: Date = new Date()): number => {
  const nextMidnightUtc = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
  )
  return nextMidnightUtc - now.getTime()
}

/** Format a duration as HH:MM:SS, clamped at zero. */
export const formatCountdown = (ms: number): string => {
  const total = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}
