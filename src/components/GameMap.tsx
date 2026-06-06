import { useEffect } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const ESRI_TILE_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
const ESRI_MAX_ZOOM = 19
const FLY_DURATION_S = 1.2

interface MapControllerProps {
  lat: number
  lng: number
  zoomLevel: number
}

/** Drives programmatic re-centering: animates to the target on any prop change. */
function MapController({ lat, lng, zoomLevel }: MapControllerProps) {
  const map = useMap()

  useEffect(() => {
    map.flyTo([lat, lng], zoomLevel, { duration: FLY_DURATION_S })
  }, [map, lat, lng, zoomLevel])

  return null
}

interface GameMapProps {
  lat: number
  lng: number
  zoomLevel: number
}

/**
 * Locked satellite view. All user interaction is disabled — the player only
 * sees what the game reveals. `zoomLevel` changes trigger a flyTo animation.
 */
export function GameMap({ lat, lng, zoomLevel }: GameMapProps) {
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
      <TileLayer
        url={ESRI_TILE_URL}
        maxNativeZoom={ESRI_MAX_ZOOM}
        maxZoom={ESRI_MAX_ZOOM}
      />
      <MapController lat={lat} lng={lng} zoomLevel={zoomLevel} />
    </MapContainer>
  )
}
