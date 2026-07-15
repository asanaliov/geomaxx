import type { Location } from '../types'

const COMMONS_API_URL = 'https://commons.wikimedia.org/w/api.php'
const SEARCH_RESULT_LIMIT = 6
const PHOTO_LIMIT = 3

interface MetadataValue {
  value?: string
}

interface CommonsImageInfo {
  descriptionurl?: string
  extmetadata?: {
    Artist?: MetadataValue
    LicenseShortName?: MetadataValue
    LicenseUrl?: MetadataValue
  }
  mime?: string
  thumburl?: string
}

interface CommonsPage {
  index?: number
  imageinfo?: CommonsImageInfo[]
  title?: string
}

interface CommonsResponse {
  error?: {
    info?: string
  }
  query?: {
    pages?: CommonsPage[]
  }
}

export interface LandmarkPhoto {
  artist: string
  descriptionUrl: string
  license: string
  licenseUrl: string
  thumbnailUrl: string
}

const photoCache = new Map<string, LandmarkPhoto[]>()
const SEARCH_STOP_WORDS = new Set(['at', 'of', 'the'])

/** Convert the HTML-formatted Commons metadata into safe plain text. */
const metadataText = (metadata?: MetadataValue): string => {
  if (!metadata?.value) return ''

  const document = new DOMParser().parseFromString(metadata.value, 'text/html')
  return (document.body.textContent ?? '').replace(/\s+/g, ' ').trim()
}

const toLandmarkPhoto = (page: CommonsPage): LandmarkPhoto | null => {
  const image = page.imageinfo?.[0]
  if (
    !image?.thumburl?.startsWith('https://') ||
    !image.descriptionurl?.startsWith('https://') ||
    !image.mime?.startsWith('image/') ||
    image.mime === 'image/svg+xml'
  ) {
    return null
  }

  const metadata = image.extmetadata
  const licenseUrl = metadata?.LicenseUrl?.value

  return {
    artist: metadataText(metadata?.Artist) || 'Unknown creator',
    descriptionUrl: image.descriptionurl,
    license: metadataText(metadata?.LicenseShortName) || 'View license',
    licenseUrl: licenseUrl?.startsWith('https://')
      ? licenseUrl
      : image.descriptionurl,
    thumbnailUrl: image.thumburl,
  }
}

const normalizedWords = (value: string): string[] =>
  value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .match(/[a-z0-9]+/g)
    ?.filter((word) => !SEARCH_STOP_WORDS.has(word)) ?? []

/** Keep only files whose title contains the meaningful landmark words. */
const titleMatches = (page: CommonsPage, searchTerm: string): boolean => {
  if (!page.title) return false
  const titleWords = new Set(normalizedWords(page.title))
  return normalizedWords(searchTerm).every((word) => titleWords.has(word))
}

/**
 * Find a few reusable photos for a landmark and include the attribution data
 * required to credit each creator and license in the UI.
 */
export async function fetchLandmarkPhotos(
  location: Pick<Location, 'name' | 'country' | 'photoSearch'>,
  signal?: AbortSignal,
): Promise<LandmarkPhoto[]> {
  const cacheKey = `${location.name}|${location.country}|${location.photoSearch ?? ''}`
  const cached = photoCache.get(cacheKey)
  if (cached) return cached

  const searchTerm = (location.photoSearch ?? location.name).replaceAll('"', '')

  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    formatversion: '2',
    generator: 'search',
    gsrsearch: `intitle:"${searchTerm}" ${location.country} filetype:bitmap`,
    gsrnamespace: '6',
    gsrlimit: String(SEARCH_RESULT_LIMIT),
    prop: 'imageinfo',
    iiprop: 'url|mime|extmetadata',
    iiurlwidth: '800',
    iiextmetadatafilter: 'Artist|LicenseShortName|LicenseUrl',
    iiextmetadatalanguage: 'en',
    origin: '*',
  })

  const response = await fetch(`${COMMONS_API_URL}?${params}`, { signal })
  if (!response.ok) {
    throw new Error(`Wikimedia Commons request failed (${response.status})`)
  }

  const data = (await response.json()) as CommonsResponse
  if (data.error) {
    throw new Error(data.error.info || 'Wikimedia Commons returned an error')
  }

  const photos = (data.query?.pages ?? [])
    .toSorted((a, b) => (a.index ?? Infinity) - (b.index ?? Infinity))
    .filter((page) => titleMatches(page, searchTerm))
    .map(toLandmarkPhoto)
    .filter((photo): photo is LandmarkPhoto => photo !== null)
    .slice(0, PHOTO_LIMIT)

  photoCache.set(cacheKey, photos)
  return photos
}
