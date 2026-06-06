import type { GuessResult } from '../types'

/** Label shown in the zoom badge for each zoom-out step. */
const ZOOM_LABELS = ['STREET', 'BLOCK', 'DISTRICT', 'CITY', 'REGION', 'COUNTRY']

/** Distance-bucket colours: green <500, yellow <1500, orange <3000, red beyond. */
const distanceStyle = (km: number): { border: string; text: string } => {
  if (km < 500) return { border: 'border-success', text: 'text-success' }
  if (km < 1500) return { border: 'border-warning', text: 'text-warning' }
  if (km < 3000) return { border: 'border-orange', text: 'text-orange' }
  return { border: 'border-accent', text: 'text-accent' }
}

interface HUDProps {
  guesses: GuessResult[]
  maxGuesses: number
  zoomIndex: number
}

/** Read-only overlay rendered above the map: progress, zoom badge, guess chips. */
export function HUD({ guesses, maxGuesses, zoomIndex }: HUDProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 p-3">
      <div className="absolute left-3 top-3 flex flex-col gap-2">
        <div className="flex items-center gap-2 rounded bg-surface/90 px-2.5 py-1.5 shadow">
          <span className="font-mono text-sm font-bold text-text">
            {guesses.length}/{maxGuesses}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: maxGuesses }, (_, i) => {
              const g = guesses[i]
              const cls = !g
                ? 'border border-border'
                : g.correct
                  ? 'bg-success'
                  : 'bg-accent'
              return <span key={i} className={`h-2.5 w-2.5 rounded-full ${cls}`} />
            })}
          </div>
        </div>

        <div className="self-start rounded bg-surface/90 px-2.5 py-1 font-mono text-xs text-text-dim shadow">
          ZOOM ×{zoomIndex + 1} {ZOOM_LABELS[zoomIndex]}
        </div>
      </div>

      <div className="absolute right-3 top-3 flex w-44 flex-col gap-2">
        {guesses.map((g) => {
          const s = distanceStyle(g.distanceKm)
          return (
            <div
              key={g.locationName}
              className={`flex animate-slide-in-right items-center justify-between gap-2 rounded border-l-4 bg-surface/90 px-2.5 py-1.5 shadow ${s.border}`}
            >
              <span className="min-w-0 flex-1 truncate font-sans text-xs text-text">
                {g.locationName}
              </span>
              <span
                className={`shrink-0 font-mono text-xs font-bold ${
                  g.correct ? 'text-success' : s.text
                }`}
              >
                {g.correct ? '✓' : `${g.distanceKm.toLocaleString()} km`}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
