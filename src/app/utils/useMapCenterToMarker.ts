import { LatLngLiteral } from 'leaflet'
import { useEffect } from 'react'
import { useMapInstance } from '@datapunt/react-maps'

const useMapCenterToMarker = (location: LatLngLiteral | null) => {
  const mapInstance = useMapInstance()

  useEffect(() => {
    if (mapInstance && location) {
      // note that "flyTo" will cause problems with Leaflet.RotateMarker
      mapInstance.panTo(location)
    }
  }, [mapInstance, location])
}

export default useMapCenterToMarker
