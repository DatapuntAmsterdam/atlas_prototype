import { useMapInstance } from '@amsterdam/react-maps'
import { LatLngBounds, LatLngLiteral } from 'leaflet'

const useMapCenterToMarker = () => {
  const mapInstance = useMapInstance()

  const panToWithPanelOffset = (boundOrLatLng: LatLngBounds | LatLngLiteral) => {
    const drawerPanel = document.querySelector('[data-testid="drawerPanel"]')
    const drawerPanelWidth = drawerPanel instanceof HTMLElement ? drawerPanel.offsetWidth : 0
    if (boundOrLatLng instanceof LatLngBounds) {
      mapInstance.fitBounds(boundOrLatLng, {
        // Always subtract a value of 1 because leaflet zooms in too much.
        maxZoom: mapInstance.getBoundsZoom(boundOrLatLng) - 1,
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
