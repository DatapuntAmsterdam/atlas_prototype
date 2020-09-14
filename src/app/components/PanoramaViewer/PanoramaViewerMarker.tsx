import React, { useEffect, useState } from 'react'
import { Icon, Marker as MarkerType } from 'leaflet'
import { Marker } from '@datapunt/arm-core'
import useParam from '../../utils/useParam'
import { panoViewerSettingsParam } from '../../pages/MapPage/query-params'
import useMapClick from '../../utils/useMapClick'
import useMapCenterToMarker from '../../utils/useMapCenterToMarker'
import { MarkerProps } from '../../pages/MapPage/MapMarkers'
import 'leaflet-rotatedmarker'

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
  const [panoViewerSettings] = useParam(panoViewerSettingsParam)
  // Todo, be able to give a x & y offset (when MapPanel is open)
  useMapCenterToMarker(location)

  useMapClick(({ latlng }) => {
    setLocation(latlng)
  })

  useEffect(() => {
    if (orientationMarker && panoViewerSettings) {
      orientationMarker.setRotationAngle(panoViewerSettings.heading)
    }
  }, [orientationMarker, panoViewerSettings])

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
