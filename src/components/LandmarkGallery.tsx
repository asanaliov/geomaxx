import { useEffect, useState } from 'react'
import type { Location } from '../types'
import {
  fetchLandmarkPhotos,
  type LandmarkPhoto,
} from '../lib/landmarkPhotos'

interface LandmarkGalleryProps {
  location: Location
}

export function LandmarkGallery({ location }: LandmarkGalleryProps) {
  const [photos, setPhotos] = useState<LandmarkPhoto[] | null>(null)
  const [failedUrls, setFailedUrls] = useState<Set<string>>(() => new Set())
  const [hasRequestError, setHasRequestError] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    fetchLandmarkPhotos(location, controller.signal)
      .then((results) => {
        if (active) setPhotos(results)
      })
      .catch((error: unknown) => {
        if (!active) return
        if (error instanceof DOMException && error.name === 'AbortError') return
        setHasRequestError(true)
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [location])

  const visiblePhotos = photos?.filter(
    (photo) => !failedUrls.has(photo.thumbnailUrl),
  )
  const showUnavailable =
    hasRequestError || (visiblePhotos !== undefined && visiblePhotos.length === 0)

  const markImageFailed = (thumbnailUrl: string) => {
    setFailedUrls((current) => {
      const next = new Set(current)
      next.add(thumbnailUrl)
      return next
    })
  }

  return (
    <section className="mt-5 text-left" aria-labelledby="landmark-photos-title">
      <div className="flex items-baseline justify-between gap-3">
        <h3
          id="landmark-photos-title"
          className="font-mono text-xs uppercase tracking-widest text-text-dim"
        >
          Landmark photos
        </h3>
        <span className="font-sans text-[10px] text-text-dim">
          Wikimedia Commons
        </span>
      </div>

      {photos === null && !hasRequestError && (
        <div
          className="mt-2 grid animate-pulse grid-cols-3 gap-2"
          role="status"
        >
          <span className="sr-only">Loading landmark photos</span>
          {[0, 1, 2].map((placeholder) => (
            <div
              key={placeholder}
              aria-hidden="true"
              className="aspect-square rounded-sm bg-surface-2"
            />
          ))}
        </div>
      )}

      {showUnavailable && (
        <div
          role="status"
          className="mt-2 rounded-sm border border-border bg-surface-2 px-3 py-4 text-center"
        >
          <p className="font-sans text-xs text-text-dim">
            Photos are unavailable right now.
          </p>
        </div>
      )}

      {visiblePhotos && visiblePhotos.length > 0 && (
        <>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {visiblePhotos.map((photo, index) => (
              <a
                key={photo.thumbnailUrl}
                href={photo.descriptionUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open photo ${index + 1} on Wikimedia Commons`}
                className="group relative aspect-square overflow-hidden rounded-sm border border-border bg-surface-2"
              >
                <img
                  src={photo.thumbnailUrl}
                  alt={`${location.name}, photo ${index + 1}`}
                  loading="lazy"
                  onError={() => markImageFailed(photo.thumbnailUrl)}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute bottom-1 left-1 rounded-sm bg-black/70 px-1.5 py-0.5 font-mono text-[9px] font-bold text-white">
                  {index + 1}
                </span>
              </a>
            ))}
          </div>

          <ol className="mt-2 space-y-1">
            {visiblePhotos.map((photo, index) => (
              <li
                key={photo.thumbnailUrl}
                className="flex items-start gap-1.5 font-sans text-[10px] leading-4 text-text-dim"
              >
                <span className="shrink-0 font-mono text-text">{index + 1}.</span>
                <span>
                  <a
                    href={photo.descriptionUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-text hover:underline"
                  >
                    {photo.artist}
                  </a>{' '}
                  ·{' '}
                  <a
                    href={photo.licenseUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-text hover:underline"
                  >
                    {photo.license}
                  </a>
                </span>
              </li>
            ))}
          </ol>
        </>
      )}
    </section>
  )
}
