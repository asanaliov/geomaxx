import type { GameState, Stats } from '../types'

const GAME_KEY = 'geomaxx:game'
const STATS_KEY = 'geomaxx:stats'

const DEFAULT_STATS: Stats = {
  played: 0,
  won: 0,
  currentStreak: 0,
  maxStreak: 0,
  distribution: [0, 0, 0, 0, 0, 0, 0],
}

/** Persist the current puzzle's game state. */
export const saveGame = (state: GameState): void => {
  localStorage.setItem(GAME_KEY, JSON.stringify(state))
}

/**
 * Load the saved game only if it matches the current puzzle. Returns null when
 * nothing is stored, the stored game is for a different (stale) puzzle, or the
 * stored data is corrupt — so the caller starts a fresh game in those cases.
 */
export const loadGame = (currentPuzzleNumber: number): GameState | null => {
  const raw = localStorage.getItem(GAME_KEY)
  if (!raw) return null

  try {
    const state = JSON.parse(raw) as GameState
    if (state.puzzleNumber !== currentPuzzleNumber) return null
    return state
  } catch {
    return null
  }
}

/** Persist aggregate play statistics. */
export const saveStats = (stats: Stats): void => {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats))
}

/** Load aggregate statistics, falling back to zeroed defaults. */
export const loadStats = (): Stats => {
  const raw = localStorage.getItem(STATS_KEY)
  if (!raw) return { ...DEFAULT_STATS }

  try {
    return JSON.parse(raw) as Stats
  } catch {
    return { ...DEFAULT_STATS }
  }
}
