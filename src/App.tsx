function App() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
      <h1 className="font-mono text-4xl font-bold tracking-tight text-text">
        🌍 GEOMAXX
      </h1>
      <p className="font-sans text-text-dim">
        Daily satellite image guessing game — scaffold ready.
      </p>
      <div className="mt-2 flex gap-2">
        <span className="rounded bg-success px-3 py-1 font-mono text-sm text-bg">
          Tailwind OK
        </span>
        <span className="rounded bg-accent px-3 py-1 font-mono text-sm text-bg">
          Fonts OK
        </span>
      </div>
    </div>
  )
}

export default App
