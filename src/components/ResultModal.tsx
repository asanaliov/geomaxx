import { useRef, useState } from 'react'
import type { GuessResult, Location } from '../types'
import { buildShareText, guessEmoji } from '../lib/score'
import { useCountdown } from '../hooks/useCountdown'
import { Modal } from './Modal'

/** Win titles indexed by guess count (1–6). Index 0 is unused. */
const WIN_TITLES = ['', 'Incredible!', 'Genius!', 'Impressive!', 'Solid!', 'Phew!', 'Just made it!']
const TOAST_MS = 2000

interface ResultModalProps {
  open: boolean
  won: boolean
  answer: Location
  guesses: GuessResult[]
  puzzleNumber: number
  onClose: () => void
}

export function ResultModal({
  open,
  won,
  answer,
  guesses,
  puzzleNumber,
  onClose,
}: ResultModalProps) {
  const [copied, setCopied] = useState(false)
  const toastTimer = useRef<number | undefined>(undefined)
  const countdown = useCountdown(open)

  const handleShare = async () => {
    const text = buildShareText(puzzleNumber, won, guesses)
    // Prefer the native share sheet (mobile); fall back to the clipboard.
    if (navigator.share) {
      try {
        await navigator.share({ text })
        return
      } catch {
        // Cancelled or unsupported payload — fall through to clipboard.
      }
    }
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.clearTimeout(toastTimer.current)
      toastTimer.current = window.setTimeout(() => setCopied(false), TOAST_MS)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="text-center">
        <div className="text-5xl">{won ? '🎉' : '😔'}</div>
        <h2 className="mt-3 font-mono text-2xl font-bold text-text">
          {won ? WIN_TITLES[guesses.length] : 'Better luck tomorrow'}
        </h2>
        <p className="mt-1 font-sans text-text-dim">
          {won ? 'It was ' : 'It was: '}
          <span className="font-semibold text-text">{answer.name}</span>
          <span className="text-text-dim">, {answer.country}</span>
        </p>

        <div className="mt-4 text-2xl tracking-wide">
          {guesses.map((g, i) => (
            <span key={i}>{guessEmoji(g.distanceKm)}</span>
          ))}
        </div>
        <p className="mt-1 font-mono text-sm text-text-dim">
          {won ? guesses.length : 'X'}/6
        </p>

        <div className="mt-5 rounded-sm border border-border bg-surface-2 px-4 py-2.5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-text-dim">
            Next puzzle in
          </p>
          <p className="font-mono text-xl font-bold tabular-nums text-text">
            {countdown}
          </p>
        </div>

        <button
          type="button"
          onClick={handleShare}
          className="mt-4 w-full rounded-sm bg-success px-4 py-2.5 font-mono text-sm font-bold text-bg transition-opacity hover:opacity-90"
        >
          Share
        </button>
      </div>

      {copied && (
        <div className="fixed bottom-8 left-1/2 z-[1200] -translate-x-1/2 animate-pop rounded-sm bg-text px-3 py-1.5 font-mono text-xs font-bold text-bg shadow-panel">
          Copied!
        </div>
      )}
    </Modal>
  )
}
