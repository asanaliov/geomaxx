import { Modal } from './Modal'

const LEGEND = [
  { emoji: '🟩', label: 'within 500 km' },
  { emoji: '🟨', label: 'within 1,500 km' },
  { emoji: '🟧', label: 'within 3,000 km' },
  { emoji: '🟥', label: 'farther away' },
]

interface HelpModalProps {
  open: boolean
  onClose: () => void
}

export function HelpModal({ open, onClose }: HelpModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="font-mono text-2xl font-bold text-text">How to play</h2>
      <p className="mt-1 font-sans text-sm text-text-dim">
        Identify the landmark from a satellite view in 6 guesses.
      </p>

      <ul className="mt-4 space-y-2 font-sans text-sm text-text">
        <li>🛰️ You start zoomed all the way in.</li>
        <li>📉 Each wrong guess zooms the map out, revealing more.</li>
        <li>📏 After every guess you see how far off you were.</li>
      </ul>

      <div className="mt-5">
        <p className="font-mono text-xs uppercase tracking-wide text-text-dim">
          Zoom progression
        </p>
        <p className="mt-1 font-mono text-sm text-text">
          ×1 STREET → ×2 BLOCK → ×3 DISTRICT → ×4 CITY → ×5 REGION → ×6 COUNTRY
        </p>
      </div>

      <div className="mt-5">
        <p className="font-mono text-xs uppercase tracking-wide text-text-dim">
          Distance legend
        </p>
        <ul className="mt-2 space-y-1 font-sans text-sm text-text">
          {LEGEND.map((l) => (
            <li key={l.emoji} className="flex items-center gap-2">
              <span>{l.emoji}</span>
              <span className="text-text-dim">{l.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-5 font-sans text-xs text-text-dim">
        A new puzzle drops every day at midnight UTC.
      </p>
    </Modal>
  )
}
