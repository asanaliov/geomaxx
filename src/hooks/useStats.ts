import { useCallback, useEffect, useState } from 'react'
import type { Stats } from '../types'
import { loadStats, saveStats } from '../lib/storage'

interface UseStats {
  stats: Stats
  /** Record a finished game. No-ops if this puzzle was already recorded. */
  recordResult: (puzzleNumber: number, won: boolean, guessCount: number) => void
}

/** Tracks lifetime play statistics, persisted to localStorage. */
export function useStats(): UseStats {
  const [stats, setStats] = useState<Stats>(loadStats)

  useEffect(() => {
    saveStats(stats)
  }, [stats])

  const recordResult = useCallback(
    (puzzleNumber: number, won: boolean, guessCount: number) => {
      setStats((prev) => {
        if (prev.lastPuzzle === puzzleNumber) return prev

        const bucket = won ? guessCount - 1 : 6
        const consecutive = puzzleNumber === prev.lastPuzzle + 1
        const currentStreak = won ? (consecutive ? prev.currentStreak + 1 : 1) : 0

        return {
          played: prev.played + 1,
          won: prev.won + (won ? 1 : 0),
          currentStreak,
          maxStreak: Math.max(prev.maxStreak, currentStreak),
          distribution: prev.distribution.map((c, i) =>
            i === bucket ? c + 1 : c,
          ),
          lastPuzzle: puzzleNumber,
        }
      })
    },
    [],
  )

  return { stats, recordResult }
}
