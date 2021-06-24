import { ascDefaultTheme, breakpoint } from '@amsterdam/asc-ui'
import { useMapInstance } from '@amsterdam/react-maps'
import type { LatLngLiteral } from 'leaflet'
import { LatLngBounds } from 'leaflet'
import {
  LAPTOP_WIDTH,
  TABLET_M_WIDTH,
} from '../pages/MapPage/components/DrawerPanel/LargeDrawerPanel'

const MAX_ZOOM = 14

const useMapCenterToMarker = () => {
  const mapInstance = useMapInstance()

  const panToWithPanelOffset = (boundOrLatLng: LatLngBounds | LatLngLiteral) => {
    let drawerWidth = TABLET_M_WIDTH
    if (window.matchMedia(breakpoint('min-width', 'laptopM')({ theme: ascDefaultTheme })).matches) {
      drawerWidth = LAPTOP_WIDTH
    }

    if (boundOrLatLng instanceof LatLngBounds) {
      const boundsZoom = mapInstance.getBoundsZoom(boundOrLatLng)
      mapInstance.fitBounds(boundOrLatLng, {
        maxZoom: boundsZoom > MAX_ZOOM ? MAX_ZOOM : boundsZoom,
        paddingTopLeft: [drawerWidth, 0],
      })
    } else {
      const { x, y } = mapInstance.latLngToContainerPoint(boundOrLatLng)
      // We have to subtract the position with a value that "pushes" the marker to the visual centre of the map
      // This value is calculated by dividing the drawerPanel width by 2
      const newLocation = mapInstance.containerPointToLatLng([x - drawerWidth / 2, y])
      mapInstance.panTo(newLocation)
    }
  }

  return {
    panToWithPanelOffset,
  }
}

export default useMapCenterToMarker
