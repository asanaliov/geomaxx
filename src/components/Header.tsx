interface HeaderProps {
  puzzleNumber: number
  onHelp: () => void
  onStats: () => void
}

const ICON_BUTTON =
  'flex h-9 w-9 items-center justify-center rounded-sm border border-transparent text-text-dim transition-colors hover:border-border hover:bg-surface-2 hover:text-text'

export function Header({ puzzleNumber, onHelp, onStats }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-surface/60 px-4 py-2.5">
      <div className="flex items-baseline gap-3">
        <h1 className="font-mono text-lg font-bold tracking-tight text-text">
          GEO<span className="text-accent">MAXX</span>
        </h1>
        <span className="hidden items-center gap-1.5 font-mono text-[11px] tracking-widest text-text-dim sm:flex">
          <span className="h-1.5 w-1.5 animate-blink rounded-full bg-success" />
          SAT&nbsp;LINK&nbsp;LIVE
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="font-mono text-xs tracking-wider text-text-dim">
          PUZZLE&nbsp;<span className="text-text">#{puzzleNumber}</span>
        </span>
        <span className="mx-1 h-5 w-px bg-border" />
        <button
          type="button"
          onClick={onHelp}
          aria-label="How to play"
          className={ICON_BUTTON}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M9.5 9.3a2.5 2.5 0 1 1 3.4 2.33c-.6.24-.9.7-.9 1.37v.5" />
            <circle cx="12" cy="17" r="0.5" fill="currentColor" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onStats}
          aria-label="Statistics"
          className={ICON_BUTTON}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M5 20V12" />
            <path d="M12 20V5" />
            <path d="M19 20v-6" />
          </svg>
        </button>
      </div>
    </header>
  )
}
