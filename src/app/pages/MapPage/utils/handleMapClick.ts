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
  if (activeOverlays && activeOverlays.length > 0) {
    const activeOverlaysWithInstanceAPI = activeOverlays.filter(
      // @ts-ignore TODO: auto generate types
      (activeOverlay) => activeOverlay.detailUrl,
    )

    const nearestDetail: NearestDetail | null = await fetchNearestDetail(
      { latitude: e.latlng.lat, longitude: e.latlng.lng },
      activeOverlaysWithInstanceAPI,
      8,
    )

    if (nearestDetail) {
      const detailUrl = joinUrl(nearestDetail.type, nearestDetail.id)
      setDetailUrl(detailUrl)
    } else {
      setLocation(e.latlng)
    }
  } else {
    // get the geo search information
    setLocation(e.latlng)
  }
}
