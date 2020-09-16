import { Marker } from '@datapunt/arm-core'
import { Icon, Marker as MarkerType } from 'leaflet'
import 'leaflet-rotatedmarker'
import React, { useEffect, useState } from 'react'
import { MarkerProps } from '../../pages/MapPage/MapMarkers'
import { panoParam } from '../../pages/MapPage/query-params'
import useMapCenterToMarker from '../../utils/useMapCenterToMarker'
import useMapClick from '../../utils/useMapClick'
import useParam from '../../utils/useParam'

const orientationIcon = new Icon({
  iconUrl: '/assets/images/map/panorama-orientation.svg',
  iconSize: [70, 70],
  iconAnchor: [35, 35],
})

const pawnIcon = new Icon({
  iconUrl: '/assets/images/map/panorama-person.svg',
  iconSize: [18, 31],
  iconAnchor: [9, 22],
})

const PanoramaViewerMarker: React.FC<MarkerProps> = ({ location, setLocation }) => {
  const [orientationMarker, setOrientationMarker] = useState<MarkerType>()
  const [pano] = useParam(panoParam)
  // Todo, be able to give a x & y offset (when MapPanel is open)
  useMapCenterToMarker(location)

  useMapClick(({ latlng }) => {
    setLocation(latlng)
  })

  useEffect(() => {
    if (orientationMarker && pano) {
      orientationMarker.setRotationAngle(pano.heading)
    }
  }, [orientationMarker, pano])

  return location ? (
    <>
      <Marker
        setInstance={setOrientationMarker}
        latLng={location}
        options={{ icon: orientationIcon }}
      />
      <Marker latLng={location} options={{ icon: pawnIcon }} />
    </>
  ) : null
}

export default PanoramaViewerMarker
