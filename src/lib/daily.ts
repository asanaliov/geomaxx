import { LOCATIONS } from './locations'

/**
 * Launch day for puzzle numbering — puzzle #0 is this UTC date.
 * PERMANENT: changing this renumbers every player's puzzle history.
 */
const LAUNCH_EPOCH_MS = Date.UTC(2025, 0, 1)

const MS_PER_DAY = 86_400_000

/** mulberry32 — fast, well-distributed seeded PRNG. Returns [0, 1). */
const mulberry32 = (seed: number): number => {
  let t = (seed + 0x6d2b79f5) | 0
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

/** UTC midnight (start of day) for the given date, in milliseconds. */
const utcMidnightMs = (date: Date): number =>
  Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())

/**
 * Sequential puzzle number for a date: whole UTC days since the launch epoch.
 * Defaults to today.
 */
export const getPuzzleNumber = (date: Date = new Date()): number =>
  Math.floor((utcMidnightMs(date) - LAUNCH_EPOCH_MS) / MS_PER_DAY)

/**
 * Index into LOCATIONS for a given date's puzzle. Deterministic per UTC date:
 * the same date always yields the same answer, regardless of timezone.
 */
export const getDailyIndex = (date: Date = new Date()): number => {
  const puzzleNumber = getPuzzleNumber(date)
  return Math.floor(mulberry32(puzzleNumber) * LOCATIONS.length)
}
