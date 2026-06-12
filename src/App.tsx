import { useEffect, useState } from 'react'
import { GameMap } from './components/GameMap'
import { GameOverBar } from './components/GameOverBar'
import { GuessInput } from './components/GuessInput'
import { Header } from './components/Header'
import { HelpModal } from './components/HelpModal'
import { HUD } from './components/HUD'
import { ResultModal } from './components/ResultModal'
import { StatsModal } from './components/StatsModal'
import { MAX_GUESSES, useGame } from './hooks/useGame'
import { useMidnightReload } from './hooks/useMidnightReload'
import { useStats } from './hooks/useStats'
import { hasSeenHelp, markHelpSeen } from './lib/storage'

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

  const { stats, recordResult } = useStats()
  useMidnightReload()

  const [modalOpen, setModalOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(() => !hasSeenHelp())
  const [statsOpen, setStatsOpen] = useState(false)

  const guessCount = guesses.length

  useEffect(() => {
    if (!gameOver) return
    recordResult(puzzleNumber, won, guessCount)
    const timer = setTimeout(() => setModalOpen(true), REVEAL_DELAY_MS)
    return () => clearTimeout(timer)
  }, [gameOver, puzzleNumber, won, guessCount, recordResult])

  const closeHelp = () => {
    setHelpOpen(false)
    markHelpSeen()
  }

  const mapZoom = won ? REVEAL_ZOOM : currentZoom
  const todayBucket = gameOver ? (won ? guessCount - 1 : 6) : null

  return (
    <div className="flex h-full flex-col">
      <Header
        puzzleNumber={puzzleNumber}
        onHelp={() => setHelpOpen(true)}
        onStats={() => setStatsOpen(true)}
      />

      <main className="relative flex-1">
        <GameMap
          lat={answer.lat}
          lng={answer.lng}
          zoomLevel={mapZoom}
          revealMarker={gameOver}
        />
        <HUD
          guesses={guesses}
          maxGuesses={MAX_GUESSES}
          zoomIndex={zoomIndex}
          gameOver={gameOver}
        />
      </main>

      {gameOver ? (
        <GameOverBar won={won} onShowResults={() => setModalOpen(true)} />
      ) : (
        <GuessInput guesses={guesses} disabled={false} onGuess={submitGuess} />
      )}

      <ResultModal
        open={modalOpen}
        won={won}
        answer={answer}
        guesses={guesses}
        puzzleNumber={puzzleNumber}
        onClose={() => setModalOpen(false)}
      />

      <HelpModal open={helpOpen} onClose={closeHelp} />

      <StatsModal
        open={statsOpen}
        onClose={() => setStatsOpen(false)}
        stats={stats}
        highlightBucket={todayBucket}
      />
    </div>
  )
}

export default App
