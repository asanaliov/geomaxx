import { useEffect, type ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
}

/**
 * Shared modal shell: dimmed backdrop, centered pop-in card, close button.
 * Closes on Escape or backdrop click and locks body scroll while open.
 */
export function Modal({ open, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[1100] flex animate-fade-in items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[85vh] w-full max-w-sm animate-pop overflow-y-auto rounded-lg border border-border bg-surface p-6 shadow-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 font-mono text-lg leading-none text-text-dim hover:text-text"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  )
}
