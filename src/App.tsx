import { GameMap } from './components/GameMap'
import { GuessInput } from './components/GuessInput'
import { HUD } from './components/HUD'
import { MAX_GUESSES, useGame } from './hooks/useGame'

function App() {
  const { answer, currentZoom, zoomIndex, guesses, gameOver, submitGuess } =
    useGame()

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <h1 className="font-mono text-xl font-bold tracking-tight text-text">
          🌍 GEOMAXX
        </h1>
      </header>

      <main className="relative flex-1">
        <GameMap lat={answer.lat} lng={answer.lng} zoomLevel={currentZoom} />
        <HUD guesses={guesses} maxGuesses={MAX_GUESSES} zoomIndex={zoomIndex} />
      </main>

      <GuessInput guesses={guesses} disabled={gameOver} onGuess={submitGuess} />
    </div>
  )
}

export default App
