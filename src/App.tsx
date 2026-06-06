import { useEffect, useState } from 'react'
import { GameMap } from './components/GameMap'
import { GuessInput } from './components/GuessInput'
import { HUD } from './components/HUD'
import { ResultModal } from './components/ResultModal'
import { MAX_GUESSES, useGame } from './hooks/useGame'

/** Zoom the map settles on when revealing the answer. */
const REVEAL_ZOOM = 15
/** Delay before the result modal appears, covering the reveal flyTo animation. */
const REVEAL_DELAY_MS = 1400

function App() {
  const {
    answer,
    puzzleNumber,
    currentZoom,
    zoomIndex,
    guesses,
    gameOver,
    won,
    submitGuess,
  } = useGame()

  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    if (!gameOver) return
    const timer = setTimeout(() => setModalOpen(true), REVEAL_DELAY_MS)
    return () => clearTimeout(timer)
  }, [gameOver])

  const mapZoom = won ? REVEAL_ZOOM : currentZoom

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <h1 className="font-mono text-xl font-bold tracking-tight text-text">
          🌍 GEOMAXX
        </h1>
      </header>

      <main className="relative flex-1">
        <GameMap
          lat={answer.lat}
          lng={answer.lng}
          zoomLevel={mapZoom}
          revealMarker={gameOver}
        />
        <HUD guesses={guesses} maxGuesses={MAX_GUESSES} zoomIndex={zoomIndex} />
      </main>

      <GuessInput guesses={guesses} disabled={gameOver} onGuess={submitGuess} />

      <ResultModal
        open={modalOpen}
        won={won}
        answer={answer}
        guesses={guesses}
        puzzleNumber={puzzleNumber}
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
}

export default App
