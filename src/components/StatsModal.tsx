import type { Stats } from '../types'
import { Modal } from './Modal'

const BAR_LABELS = ['1', '2', '3', '4', '5', '6', 'X']

interface StatsModalProps {
  open: boolean
  onClose: () => void
  stats: Stats
  /** Distribution index of today's result to highlight, or null. */
  highlightBucket: number | null
}

interface StatProps {
  value: number | string
  label: string
}

function Stat({ value, label }: StatProps) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-mono text-2xl font-bold text-text">{value}</span>
      <span className="font-sans text-xs text-text-dim">{label}</span>
    </div>
  )
}

export function StatsModal({
  open,
  onClose,
  stats,
  highlightBucket,
}: StatsModalProps) {
  const winPct = stats.played
    ? Math.round((stats.won / stats.played) * 100)
    : 0
  const maxCount = Math.max(...stats.distribution, 1)

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="font-mono text-2xl font-bold text-text">Statistics</h2>

      <div className="mt-4 grid grid-cols-4 gap-2">
        <Stat value={stats.played} label="Played" />
        <Stat value={`${winPct}%`} label="Win %" />
        <Stat value={stats.currentStreak} label="Streak" />
        <Stat value={stats.maxStreak} label="Max" />
      </div>

      <p className="mt-6 font-mono text-xs uppercase tracking-wide text-text-dim">
        Guess distribution
      </p>
      <div className="mt-2 space-y-1.5">
        {stats.distribution.map((count, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-3 font-mono text-xs text-text-dim">
              {BAR_LABELS[i]}
            </span>
            <div className="flex-1">
              <div
                className={`flex h-5 min-w-[1.5rem] items-center justify-end rounded-sm px-1.5 font-mono text-xs font-bold ${
                  i === highlightBucket
                    ? 'bg-accent text-bg'
                    : 'bg-surface-2 text-text'
                }`}
                style={{ width: `${(count / maxCount) * 100}%` }}
              >
                {count}
              </div>
            </div>
          </div>
        ))}
      </div>

      {stats.played === 0 && (
        <p className="mt-4 text-center font-sans text-sm text-text-dim">
          No games yet — make a guess to get started.
        </p>
      )}
    </Modal>
  )
}
