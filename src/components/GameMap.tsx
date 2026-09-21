import { useEffect } from 'react'
import { divIcon, Util, type Map as LeafletMap } from 'leaflet'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

/** Custom marker (divIcon avoids Leaflet's broken default-icon image paths). */
const ANSWER_ICON = divIcon({
  className: '',
  html: '<div class="h-4 w-4 rounded-full bg-accent ring-2 ring-white shadow-lg"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

const ESRI_TILE_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
const ESRI_MAX_ZOOM = 19
const TILE_SIZE = 256
const FLY_DURATION_S = 1.2

/**
 * Warm the browser cache with every tile the viewport will show at `zoom`,
 * so the next flyTo lands on sharp imagery instead of a blurry scale-up.
 */
const preloadTiles = (map: LeafletMap, lat: number, lng: number, zoom: number) => {
  const half = map.getSize().divideBy(2)
  const center = map.project([lat, lng], zoom)
  const min = center.subtract(half).divideBy(TILE_SIZE).floor()
  const max = center.add(half).divideBy(TILE_SIZE).floor()

  for (let x = min.x; x <= max.x; x++) {
    for (let y = min.y; y <= max.y; y++) {
      new Image().src = Util.template(ESRI_TILE_URL, { z: zoom, x, y })
    }
  }
}

interface MapControllerProps {
  lat: number
  lng: number
  zoomLevel: number
  preloadZoomLevels: number[]
}

/** Drives programmatic re-centering: animates to the target on any prop change. */
function MapController({ lat, lng, zoomLevel, preloadZoomLevels }: MapControllerProps) {
  const map = useMap()

  useEffect(() => {
    map.flyTo([lat, lng], zoomLevel, { duration: FLY_DURATION_S })
  }, [map, lat, lng, zoomLevel])

  // Preload only once the current animation has settled so the requests
  // don't compete with the tiles being shown right now.
  useEffect(() => {
    const preload = () => {
      preloadZoomLevels.forEach((zoom) => preloadTiles(map, lat, lng, zoom))
    }
    map.once('moveend', preload)
    return () => {
      map.off('moveend', preload)
    }
  }, [map, lat, lng, preloadZoomLevels])

  return null
}

interface GameMapProps {
  lat: number
  lng: number
  zoomLevel: number
  preloadZoomLevels: number[]
  revealMarker?: boolean
}

/**
 * Locked satellite view. All user interaction is disabled — the player only
 * sees what the game reveals. `zoomLevel` changes trigger a flyTo animation;
 * `revealMarker` drops a pin on the answer once the game is over.
 */
export function GameMap({
  lat,
  lng,
  zoomLevel,
  preloadZoomLevels,
  revealMarker,
}: GameMapProps) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={zoomLevel}
      className="h-full w-full bg-bg"
      zoomControl={false}
      attributionControl={false}
      dragging={false}
      doubleClickZoom={false}
      scrollWheelZoom={false}
      touchZoom={false}
      boxZoom={false}
      keyboard={false}
    >
      {/* The view never pans, so only load tiles once a flyTo has settled —
          skipping the intermediate zoom levels Leaflet would otherwise fetch
          and abort mid-animation. */}
      <TileLayer
        url={ESRI_TILE_URL}
        maxNativeZoom={ESRI_MAX_ZOOM}
        maxZoom={ESRI_MAX_ZOOM}
        updateWhenIdle
        updateWhenZooming={false}
      />
      {revealMarker && <Marker position={[lat, lng]} icon={ANSWER_ICON} />}
      <MapController
        lat={lat}
        lng={lng}
        zoomLevel={zoomLevel}
        preloadZoomLevels={preloadZoomLevels}
      />
    </MapContainer>
  )
}
