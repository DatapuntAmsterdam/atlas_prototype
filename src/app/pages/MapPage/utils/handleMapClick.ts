import { LatLngLiteral, LeafletMouseEvent } from 'leaflet'
import fetchNearestDetail from '../../../../map/services/nearest-detail/nearest-detail'
import joinUrl from '../../../utils/joinUrl'
import { MapState } from '../MapContext'

interface NearestDetail {
  id: string
  type: string
}

export default async function handleMapClick(
  e: LeafletMouseEvent,
  setLocation: (location: LatLngLiteral) => void,
  setDetailUrl: (url: string) => void,
  activeOverlays: MapState['overlays'] | undefined,
) {
  if (!activeOverlays) {
    setLocation(e.latlng)
    return
  }

  const layers = activeOverlays
    .filter((overlay) => overlay.layer.detailUrl)
    .map((overlay) => overlay.layer)

  if (layers.length === 0) {
    setLocation(e.latlng)
    return
  }

  const nearestDetail: NearestDetail | null = await fetchNearestDetail(
    { latitude: e.latlng.lat, longitude: e.latlng.lng },
    layers,
    8,
  )

  if (nearestDetail) {
    const detailUrl = joinUrl(nearestDetail.type, nearestDetail.id)
    setDetailUrl(detailUrl)
  } else {
    setLocation(e.latlng)
  }
}
