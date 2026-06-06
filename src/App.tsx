import { GameMap } from './components/GameMap'
import { getDailyIndex } from './lib/daily'
import { LOCATIONS } from './lib/locations'

/** Starting zoom for an unsolved puzzle (most zoomed-in). */
const INITIAL_ZOOM = 17

function App() {
  const answer = LOCATIONS[getDailyIndex()]

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <h1 className="font-mono text-xl font-bold tracking-tight text-text">
          🌍 GEOMAXX
        </h1>
      </header>

      <main className="relative flex-1">
        <GameMap lat={answer.lat} lng={answer.lng} zoomLevel={INITIAL_ZOOM} />
      </main>
    </div>
  )
}

export default App
