import { useEffect, useState } from 'react'
import type { GameState, GuessResult, Location } from '../types'
import { getDailyIndex, getPuzzleNumber } from '../lib/daily'
import { getDistanceKm } from '../lib/distance'
import { LOCATIONS } from '../lib/locations'
import { loadGame, saveGame } from '../lib/storage'

/**
 * Zoom level shown after each wrong guess. Index 0 is the starting view: the
 * player begins zoomed out (country) and zooms in toward the landmark with
 * every wrong guess, so the clearest view is the last reveal.
 */
export const ZOOM_LEVELS = [7, 9, 11, 13, 15, 17]
export const MAX_GUESSES = ZOOM_LEVELS.length

/** Zoom index = wrong guesses so far, capped at the most zoomed-out level. */
const zoomIndexFor = (guesses: GuessResult[]): number => {
  const wrong = guesses.filter((g) => !g.correct).length
  return Math.min(wrong, ZOOM_LEVELS.length - 1)
}

const freshState = (puzzleNumber: number): GameState => ({
  puzzleNumber,
  guesses: [],
  zoomIndex: 0,
  gameOver: false,
  won: false,
})

interface UseGame {
  answer: Location
  puzzleNumber: number
  guesses: GuessResult[]
  currentZoom: number
  zoomIndex: number
  gameOver: boolean
  won: boolean
  remainingGuesses: number
  submitGuess: (locationName: string) => GuessResult | null
}

/**
 * Core game state machine for today's puzzle. Resumes a saved game on init and
 * auto-persists after every change.
 */
export function useGame(): UseGame {
  const puzzleNumber = getPuzzleNumber()
  const answer = LOCATIONS[getDailyIndex()]

  const [state, setState] = useState<GameState>(
    () => loadGame(puzzleNumber) ?? freshState(puzzleNumber),
  )

  useEffect(() => {
    saveGame(state)
  }, [state])

  const submitGuess = (locationName: string): GuessResult | null => {
    if (state.gameOver) return null

    const guess = LOCATIONS.find((l) => l.name === locationName)
    if (!guess) return null

    const result: GuessResult = {
      locationName,
      distanceKm: getDistanceKm(guess.lat, guess.lng, answer.lat, answer.lng),
      correct: guess.name === answer.name,
    }

    const guesses = [...state.guesses, result]
    setState({
      puzzleNumber,
      guesses,
      zoomIndex: zoomIndexFor(guesses),
      won: result.correct,
      gameOver: result.correct || guesses.length >= MAX_GUESSES,
    })

    return result
  }

  return {
    answer,
    puzzleNumber,
    guesses: state.guesses,
    currentZoom: ZOOM_LEVELS[state.zoomIndex],
    zoomIndex: state.zoomIndex,
    gameOver: state.gameOver,
    won: state.won,
    remainingGuesses: MAX_GUESSES - state.guesses.length,
    submitGuess,
  }
}
