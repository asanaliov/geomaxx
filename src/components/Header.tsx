interface HeaderProps {
  onHelp: () => void
  onStats: () => void
}

export function Header({ onHelp, onStats }: HeaderProps) {
  const iconClass =
    'flex h-9 w-9 items-center justify-center rounded text-text-dim transition-colors hover:bg-surface-2 hover:text-text'

  return (
    <header className="flex items-center justify-between border-b border-border px-4 py-3">
      <h1 className="font-mono text-xl font-bold tracking-tight text-text">
        🌍 GEOMAXX
      </h1>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onHelp}
          aria-label="How to play"
          className={`${iconClass} font-mono text-lg font-bold`}
        >
          ?
        </button>
        <button
          type="button"
          onClick={onStats}
          aria-label="Statistics"
          className={`${iconClass} text-base`}
        >
          📊
        </button>
      </div>
    </header>
  )
}
