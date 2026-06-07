export type Continent =
  | 'Africa'
  | 'Asia'
  | 'Europe'
  | 'North America'
  | 'South America'
  | 'Oceania'
  | 'Antarctica'

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Location {
  name: string
  lat: number
  lng: number
  country: string
  continent: Continent
  difficulty: Difficulty
  /**
   * Optional per-puzzle zoom progression (must be 6 levels), overriding the
   * default wide start. For landmarks the default doesn't suit — e.g. small
   * ocean-surrounded islands that are a sub-pixel speck at the default start zoom.
   */
  zoomLevels?: number[]
}

/** A single submitted guess and its computed outcome. */
export interface GuessResult {
  /** Name of the guessed location (matches a Location.name). */
  locationName: string
  /** Great-circle distance from the answer, in kilometres. */
  distanceKm: number
  /** True when the guess is the correct answer. */
  correct: boolean
}

/** Full game state for today's puzzle, persisted to localStorage. */
export interface GameState {
  /** Puzzle number (days since launch epoch). */
  puzzleNumber: number
  /** Guesses made so far, in order. */
  guesses: GuessResult[]
  /** Index into the zoom-level progression array. */
  zoomIndex: number
  /** True once the game has ended (win or all guesses used). */
  gameOver: boolean
  /** True when the player guessed correctly. */
  won: boolean
}

/** Aggregate play history across all puzzles, persisted to localStorage. */
export interface Stats {
  /** Total games completed (win or loss). */
  played: number
  /** Total games won. */
  won: number
  /** Consecutive days won, up to and including the most recent game. */
  currentStreak: number
  /** Best streak ever achieved. */
  maxStreak: number
  /**
   * Outcome distribution. Indices 0–5 count wins in 1–6 guesses;
   * index 6 counts losses ("X").
   */
  distribution: number[]
  /** Puzzle number of the most recently recorded game (-1 if none). */
  lastPuzzle: number
}
