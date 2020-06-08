import { LeafletMouseEvent } from 'leaflet'
import { MapState, Location } from '../MapContext'
import fetchNearestDetail from '../../../../map/services/nearest-detail/nearest-detail'

type NearestDetail = {
  uri: string
}

export default async function handleMapClick(
  e: LeafletMouseEvent,
  setLocation: (location: Location) => void,
  setDetailUrl: (url: string) => void,
  activeOverlays: MapState['overlays'] | undefined,
) {
  if (activeOverlays && activeOverlays.length > 0) {
    const activeOverlaysWithInstanceAPI = activeOverlays.filter(
      // @ts-ignore TODO: auto generate types
      (activeOverlay) => activeOverlay.detailUrl,
    )

    const { uri }: NearestDetail = await fetchNearestDetail(
      { latitude: e.latlng.lat, longitude: e.latlng.lng },
      activeOverlaysWithInstanceAPI,
      8,
    )

    if (uri) {
      // get the detail information including the geojson
      setDetailUrl(uri)
    }
  } else {
    // get the geo search information
    setLocation(e.latlng)
  }
}
