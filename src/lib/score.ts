import type { GuessResult } from '../types'

/** Distance tier: 0 green (<500km), 1 yellow (<1500), 2 orange (<3000), 3 red. */
export const distanceTier = (km: number): 0 | 1 | 2 | 3 =>
  km < 500 ? 0 : km < 1500 ? 1 : km < 3000 ? 2 : 3

const TIER_EMOJI = ['🟩', '🟨', '🟧', '🟥'] as const

/** Emoji square for a single guess, by distance from the answer. */
export const guessEmoji = (km: number): string => TIER_EMOJI[distanceTier(km)]

/** Clipboard share string, e.g. `🌍 GeoMaxx #156 3/6\n🟥🟨🟩\nhttps://geomaxx.game`. */
export const buildShareText = (
  puzzleNumber: number,
  won: boolean,
  guesses: GuessResult[],
): string => {
  const score = won ? `${guesses.length}` : 'X'
  const emojis = guesses.map((g) => guessEmoji(g.distanceKm)).join('')
  return `🌍 GeoMaxx #${puzzleNumber} ${score}/6\n${emojis}\nhttps://geomaxx.game`
}
