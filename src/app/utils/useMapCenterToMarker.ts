import { useMapInstance } from '@amsterdam/react-maps'
import { LatLngLiteral } from 'leaflet'
import { useEffect } from 'react'

const useMapCenterToMarker = (location: LatLngLiteral | null) => {
  const mapInstance = useMapInstance()

  useEffect(() => {
    if (location) {
      // note that "flyTo" will cause problems with Leaflet.RotateMarker
      mapInstance.panTo(location)
    }
  }, [location])
}

export default useMapCenterToMarker
