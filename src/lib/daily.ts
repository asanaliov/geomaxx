import { LOCATIONS } from './locations'

/**
 * Launch day for puzzle numbering — puzzle #0 is this UTC date.
 * PERMANENT: changing this renumbers every player's puzzle history.
 */
const LAUNCH_EPOCH_MS = Date.UTC(2025, 0, 1)

const MS_PER_DAY = 86_400_000

/** Large odd constant to spread consecutive cycle numbers across seed space. */
const CYCLE_SEED_MULT = 0x9e3779b9

/** mulberry32 — fast, well-distributed seeded PRNG. Returns a [0, 1) stream. */
const mulberry32 = (seed: number): (() => number) => {
  let a = seed | 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
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

/** Seeded Fisher–Yates permutation of location indices for one cycle. */
const rawCycleOrder = (cycle: number): number[] => {
  const rand = mulberry32(Math.imul(cycle, CYCLE_SEED_MULT))
  const order = LOCATIONS.map((_, i) => i)
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  return order
}

/**
 * Permutation for a cycle, adjusted so its first answer never equals the
 * previous cycle's last answer (no same-landmark-two-days-in-a-row at the
 * boundary). The swap only touches positions 0/1, so a cycle's *last* element
 * is always its raw value — which keeps this check consistent across cycles.
 */
const cycleOrder = (cycle: number): number[] => {
  const order = rawCycleOrder(cycle)
  const prev = rawCycleOrder(cycle - 1)
  if (order[0] === prev[prev.length - 1]) {
    ;[order[0], order[1]] = [order[1], order[0]]
  }
  return order
}

/**
 * Index into LOCATIONS for a given date's puzzle. Deterministic per UTC date.
 * Each cycle of LOCATIONS.length days plays every location exactly once in a
 * seeded-shuffle order, so the answer is guaranteed to change daily and no
 * landmark repeats within a cycle.
 */
export const getDailyIndex = (date: Date = new Date()): number => {
  const puzzleNumber = getPuzzleNumber(date)
  const cycleLength = LOCATIONS.length
  const cycle = Math.floor(puzzleNumber / cycleLength)
  const position = ((puzzleNumber % cycleLength) + cycleLength) % cycleLength
  return cycleOrder(cycle)[position]
}
