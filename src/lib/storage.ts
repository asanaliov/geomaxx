import type { GameState, Stats } from '../types'
import { MAX_GUESSES, STATS_BUCKETS } from './gameConfig'
import { LOCATIONS } from './locations'

const GAME_KEY = 'geomaxx:game'
const STATS_KEY = 'geomaxx:stats'
const HELP_SEEN_KEY = 'geomaxx:help-seen'
const MAX_DISTANCE_KM = 20_050
const LOCATION_NAMES = new Set(LOCATIONS.map((location) => location.name))

const DEFAULT_STATS: Stats = {
  played: 0,
  won: 0,
  currentStreak: 0,
  maxStreak: 0,
  distribution: [0, 0, 0, 0, 0, 0, 0],
  lastPuzzle: -1,
}

const freshStats = (): Stats => ({
  ...DEFAULT_STATS,
  distribution: [...DEFAULT_STATS.distribution],
})

const readItem = (key: string): string | null => {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

const writeItem = (key: string, value: unknown): void => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage can be blocked or full. The game should still work in memory.
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isNonNegativeInteger = (value: unknown): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value) && value >= 0

const isPuzzleNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value) && value >= -1

const isValidGameState = (
  value: unknown,
  currentPuzzleNumber: number,
  answerName: string,
): value is GameState => {
  if (!isRecord(value) || !Array.isArray(value.guesses)) return false
  if (
    value.puzzleNumber !== currentPuzzleNumber ||
    typeof value.gameOver !== 'boolean' ||
    typeof value.won !== 'boolean' ||
    value.guesses.length > MAX_GUESSES
  ) {
    return false
  }

  const guessedNames = new Set<string>()
  let correctGuesses = 0

  for (const [index, guess] of value.guesses.entries()) {
    if (
      !isRecord(guess) ||
      typeof guess.locationName !== 'string' ||
      !LOCATION_NAMES.has(guess.locationName) ||
      guessedNames.has(guess.locationName) ||
      !isNonNegativeInteger(guess.distanceKm) ||
      guess.distanceKm > MAX_DISTANCE_KM ||
      typeof guess.correct !== 'boolean' ||
      guess.correct !== (guess.locationName === answerName)
    ) {
      return false
    }

    if (guess.correct) {
      correctGuesses += 1
      if (index !== value.guesses.length - 1) return false
    }
    guessedNames.add(guess.locationName)
  }

  const won = correctGuesses === 1
  const expectedZoomIndex = Math.min(
    value.guesses.length - correctGuesses,
    MAX_GUESSES - 1,
  )
  const expectedGameOver = won || value.guesses.length === MAX_GUESSES

  return (
    correctGuesses <= 1 &&
    value.won === won &&
    value.gameOver === expectedGameOver &&
    value.zoomIndex === expectedZoomIndex
  )
}

const isValidStats = (value: unknown): value is Stats => {
  if (!isRecord(value) || !Array.isArray(value.distribution)) return false
  if (
    !isNonNegativeInteger(value.played) ||
    !isNonNegativeInteger(value.won) ||
    !isNonNegativeInteger(value.currentStreak) ||
    !isNonNegativeInteger(value.maxStreak) ||
    !isPuzzleNumber(value.lastPuzzle) ||
    value.distribution.length !== STATS_BUCKETS ||
    !value.distribution.every(isNonNegativeInteger)
  ) {
    return false
  }

  const winsFromDistribution = value.distribution
    .slice(0, MAX_GUESSES)
    .reduce((sum, count) => sum + count, 0)
  const gamesFromDistribution = value.distribution.reduce(
    (sum, count) => sum + count,
    0,
  )

  return (
    value.won <= value.played &&
    value.currentStreak <= value.maxStreak &&
    value.maxStreak <= value.won &&
    winsFromDistribution === value.won &&
    gamesFromDistribution === value.played &&
    (value.played === 0 ? value.lastPuzzle === -1 : value.lastPuzzle >= 0)
  )
}

/** Persist the current puzzle's game state. */
export const saveGame = (state: GameState): void => {
  writeItem(GAME_KEY, state)
}

/**
 * Load the saved game only if it matches the current puzzle. Returns null when
 * nothing is stored, the stored game is for a different (stale) puzzle, or the
 * stored data is corrupt — so the caller starts a fresh game in those cases.
 */
export const loadGame = (
  currentPuzzleNumber: number,
  answerName: string,
): GameState | null => {
  const raw = readItem(GAME_KEY)
  if (!raw) return null

  try {
    const state: unknown = JSON.parse(raw)
    return isValidGameState(state, currentPuzzleNumber, answerName)
      ? state
      : null
  } catch {
    return null
  }
}

/** Persist aggregate play statistics. */
export const saveStats = (stats: Stats): void => {
  writeItem(STATS_KEY, stats)
}

/** Load aggregate statistics, falling back to zeroed defaults. */
export const loadStats = (): Stats => {
  const raw = readItem(STATS_KEY)
  if (!raw) return freshStats()

  try {
    const stats: unknown = JSON.parse(raw)
    return isValidStats(stats) ? stats : freshStats()
  } catch {
    return freshStats()
  }
}

/** Whether the player has dismissed the how-to-play modal before. */
export const hasSeenHelp = (): boolean =>
  readItem(HELP_SEEN_KEY) === '1'

export const markHelpSeen = (): void => {
  try {
    window.localStorage.setItem(HELP_SEEN_KEY, '1')
  } catch {
    // The help modal can be shown again if storage is unavailable.
  }
}
