import { useMapInstance } from '@amsterdam/react-maps'
import { LatLngBounds } from 'leaflet'
import type { LatLngLiteral } from 'leaflet'

const MAX_ZOOM = 14

const useMapCenterToMarker = () => {
  const mapInstance = useMapInstance()

  const panToWithPanelOffset = (boundOrLatLng: LatLngBounds | LatLngLiteral) => {
    const drawerPanel = document.querySelector('[data-testid="drawerPanel"]')
    const drawerPanelWidth = drawerPanel instanceof HTMLElement ? drawerPanel.offsetWidth : 0
    if (boundOrLatLng instanceof LatLngBounds) {
      const boundsZoom = mapInstance.getBoundsZoom(boundOrLatLng)
      mapInstance.fitBounds(boundOrLatLng, {
        maxZoom: boundsZoom > MAX_ZOOM ? MAX_ZOOM : boundsZoom,
        paddingTopLeft: [drawerPanelWidth, 0],
      })
    } else {
      const { x, y } = mapInstance.latLngToContainerPoint(boundOrLatLng)
      // We have to subtract the position with a value that "pushes" the marker to the visual centre of the map
      // This value is calculated by dividing the drawerPanel width by 2
      const newLocation = mapInstance.containerPointToLatLng([x - drawerPanelWidth / 2, y])
      mapInstance.panTo(newLocation)
    }
  }

  return {
    panToWithPanelOffset,
  }
}

export default useMapCenterToMarker
