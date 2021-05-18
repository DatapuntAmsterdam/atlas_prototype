import { useMapInstance } from '@amsterdam/react-maps'
import { LatLngBounds } from 'leaflet'
import type { LatLngLiteral } from 'leaflet'

const useMapCenterToMarker = () => {
  const mapInstance = useMapInstance()

  const panToWithPanelOffset = (boundOrLatLng: LatLngBounds | LatLngLiteral, maxZoom?: number) => {
    const drawerPanel = document.querySelector('[data-testid="drawerPanel"]')
    const drawerPanelWidth = drawerPanel instanceof HTMLElement ? drawerPanel.offsetWidth + 30 : 0
    const mapWidth = window.innerWidth - drawerPanelWidth

    if (boundOrLatLng instanceof LatLngBounds) {
      mapInstance.fitBounds(boundOrLatLng, { maxZoom, paddingTopLeft: [mapWidth * -1, 0] })
    } else {
      const { x, y } = mapInstance.latLngToContainerPoint(boundOrLatLng)
      const newLocation = mapInstance.containerPointToLatLng([x - drawerPanelWidth / 2, y])
      mapInstance.panTo(newLocation)
    }
  }

  return {
    panToWithPanelOffset,
  }
}

export default useMapCenterToMarker
