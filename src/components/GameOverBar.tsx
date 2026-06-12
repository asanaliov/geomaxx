import { useCountdown } from '../hooks/useCountdown'

interface GameOverBarProps {
  won: boolean
  onShowResults: () => void
}

/** Replaces the guess input once the game ends: next-puzzle countdown + results. */
export function GameOverBar({ won, onShowResults }: GameOverBarProps) {
  const countdown = useCountdown(true)

  return (
    <div className="flex animate-rise-in items-center justify-between gap-3 border-t border-border bg-surface px-4 py-3">
      <div className="flex flex-col">
        <span className="font-mono text-[10px] uppercase tracking-widest text-text-dim">
          Next puzzle in
        </span>
        <span className={`font-mono text-lg font-bold tabular-nums ${won ? 'text-success' : 'text-accent'}`}>
          {countdown}
        </span>
      </div>
      <button
        type="button"
        onClick={onShowResults}
        className="rounded-sm bg-success px-5 py-2.5 font-mono text-sm font-bold text-bg transition-opacity hover:opacity-90"
      >
        View results
      </button>
    </div>
  )
}
