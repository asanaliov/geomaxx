import { useRef, useState, type KeyboardEvent } from 'react'
import type { GuessResult } from '../types'
import { LOCATIONS } from '../lib/locations'

const MAX_SUGGESTIONS = 5
const FLASH_MS = 600

interface GuessInputProps {
  guesses: GuessResult[]
  disabled: boolean
  onGuess: (locationName: string) => void
}

export function GuessInput({ guesses, disabled, onGuess }: GuessInputProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)
  const [invalid, setInvalid] = useState(false)
  const flashTimer = useRef<number | undefined>(undefined)

  const guessed = new Set(guesses.map((g) => g.locationName))
  const q = query.trim().toLowerCase()
  const suggestions = q
    ? LOCATIONS.filter(
        (l) => !guessed.has(l.name) && l.name.toLowerCase().includes(q),
      ).slice(0, MAX_SUGGESTIONS)
    : []

  const showDropdown = open && !disabled && suggestions.length > 0

  const flashInvalid = () => {
    setInvalid(true)
    window.clearTimeout(flashTimer.current)
    flashTimer.current = window.setTimeout(() => setInvalid(false), FLASH_MS)
  }

  const submit = (name: string) => {
    const trimmed = name.trim().toLowerCase()
    if (!trimmed) return
    const match = LOCATIONS.find((l) => l.name.toLowerCase() === trimmed)
    if (!match || guessed.has(match.name)) {
      flashInvalid()
      return
    }
    onGuess(match.name)
    setQuery('')
    setOpen(false)
    setHighlight(0)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setHighlight((h) => Math.min(h + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight((h) => Math.max(h - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const picked = showDropdown ? suggestions[highlight] : suggestions[0]
      submit(picked ? picked.name : query)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="relative border-t border-border bg-surface px-4 py-3">
      {showDropdown && (
        <ul className="absolute bottom-full left-4 right-4 z-[1000] mb-2 animate-rise-in overflow-hidden rounded-sm border border-border bg-surface-2 shadow-panel">
          {suggestions.map((s, i) => (
            <li key={s.name}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault()
                  setQuery(s.name)
                  setOpen(false)
                }}
                onMouseEnter={() => setHighlight(i)}
                className={`flex w-full items-center justify-between px-3 py-2 text-left font-sans text-sm transition-colors ${
                  i === highlight ? 'bg-surface text-accent' : 'text-text'
                }`}
              >
                <span>{s.name}</span>
                <span className="font-mono text-xs text-text-dim">
                  {s.country}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          disabled={disabled}
          placeholder={disabled ? 'Game over' : 'Identify the landmark…'}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
            setHighlight(0)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={handleKeyDown}
          className={`flex-1 rounded-sm border bg-surface-2 px-3 py-2 font-sans text-text transition-colors placeholder:text-text-dim focus:outline-none ${
            invalid
              ? 'border-accent shadow-glow'
              : 'border-border focus:border-text-dim'
          }`}
        />
        <button
          type="button"
          disabled={disabled}
          onClick={() => submit(suggestions[0]?.name ?? query)}
          className="rounded-sm bg-accent px-5 py-2 font-mono text-sm font-bold text-bg transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          Guess
        </button>
      </div>
    </div>
  )
}
