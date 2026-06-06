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
