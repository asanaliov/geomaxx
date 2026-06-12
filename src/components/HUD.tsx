import type { GuessResult } from '../types'
import { distanceTier } from '../lib/score'

/** Label shown in the zoom badge for each zoom-in step (wide → close). */
const ZOOM_LABELS = ['COUNTRY', 'REGION', 'CITY', 'DISTRICT', 'BLOCK', 'STREET']

/** Tier → border/text colour classes (green, yellow, orange, red). */
const TIER_BORDER = ['border-success', 'border-warning', 'border-orange', 'border-accent']
const TIER_TEXT = ['text-success', 'text-warning', 'text-orange', 'text-accent']

const PANEL = 'rounded-sm border border-border/70 bg-surface/80 shadow-panel backdrop-blur-sm'

interface HUDProps {
  guesses: GuessResult[]
  maxGuesses: number
  zoomIndex: number
  gameOver: boolean
}

/** Read-only viewfinder overlay above the map: brackets, reticle, telemetry. */
export function HUD({ guesses, maxGuesses, zoomIndex, gameOver }: HUDProps) {
  const remaining = maxGuesses - guesses.length

  return (
    <div className="pointer-events-none absolute inset-0 z-[1000]">
      {/* Viewfinder corner brackets */}
      <span className="hud-bracket left-2 top-2" />
      <span className="hud-bracket right-2 top-2 rotate-90" />
      <span className="hud-bracket bottom-2 right-2 rotate-180" />
      <span className="hud-bracket bottom-2 left-2 -rotate-90" />

      {/* Center reticle — hidden once the answer marker drops */}
      {!gameOver && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50">
          <svg viewBox="0 0 48 48" className="h-12 w-12 text-text" fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="24" cy="24" r="14" />
            <path d="M24 2v12M24 34v12M2 24h12M34 24h12" />
          </svg>
        </div>
      )}

      {/* Zoom telemetry — stale once the reveal zoom takes over */}
      {!gameOver && (
      <div className={`absolute left-3 top-3 px-2.5 py-1.5 ${PANEL}`}>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold tracking-wider text-text">
            ZOOM&nbsp;{ZOOM_LABELS[zoomIndex]}
          </span>
          <div className="flex gap-0.5">
            {ZOOM_LABELS.map((_, i) => (
              <span
                key={i}
                className={`h-3 w-1 rounded-[1px] ${i <= zoomIndex ? 'bg-accent' : 'bg-border'}`}
              />
            ))}
          </div>
        </div>
      </div>
      )}

      {/* Guesses-left + history */}
      <div className="absolute right-3 top-3 flex w-44 max-w-[45vw] flex-col gap-1.5">
        <div className={`flex items-center justify-between gap-2 px-2.5 py-1.5 ${PANEL}`}>
          <span className="font-mono text-sm font-bold text-text">
            {remaining} <span className="text-xs font-normal tracking-wider text-text-dim">LEFT</span>
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

        {guesses.map((g) => {
          const tier = distanceTier(g.distanceKm)
          return (
            <div
              key={g.locationName}
              className={`flex animate-slide-in-right items-center justify-between gap-2 border-l-4 px-2.5 py-1.5 ${PANEL} ${TIER_BORDER[tier]}`}
            >
              <span className="min-w-0 flex-1 truncate font-sans text-xs text-text">
                {g.locationName}
              </span>
              <span
                className={`shrink-0 font-mono text-xs font-bold ${
                  g.correct ? 'text-success' : TIER_TEXT[tier]
                }`}
              >
                {g.correct ? '✓' : `${g.distanceKm.toLocaleString()} km`}
              </span>
            </div>
          )
        })}
      </div>

      {/* Required imagery attribution */}
      <div className="absolute bottom-2 right-10 rounded-sm bg-bg/60 px-1.5 py-0.5 font-sans text-[10px] text-text-dim">
        Imagery © Esri, Maxar, Earthstar Geographics
      </div>
    </div>
  )
}
