import { useMapInstance } from '@amsterdam/react-maps'
import { LatLngBounds } from 'leaflet'
import type { LatLngLiteral } from 'leaflet'

const useMapCenterToMarker = () => {
  const mapInstance = useMapInstance()

  const panToWithPanelOffset = (boundOrLatLng: LatLngBounds | LatLngLiteral, maxZoom?: number) => {
    const mapWidth =
      ((document.querySelector('[data-testid="drawerPanel"]') as HTMLElement)?.offsetWidth ?? 0) -
      window.innerWidth
    if (boundOrLatLng instanceof LatLngBounds) {
      mapInstance.fitBounds(boundOrLatLng, { maxZoom, paddingTopLeft: [mapWidth * -1, 0] })
    } else {
      const { x, y } = mapInstance.latLngToContainerPoint(boundOrLatLng)
      const newLocation = mapInstance.containerPointToLatLng([x + mapWidth / 2, y])
      mapInstance.panTo(newLocation)
    }
  }

  return {
    panToWithPanelOffset,
  }
}

export default useMapCenterToMarker
