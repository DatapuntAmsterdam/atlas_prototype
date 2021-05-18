import { Marker } from '@amsterdam/arm-core'
import { Icon, LatLngLiteral, Marker as LeafletMarker } from 'leaflet'
import 'leaflet-rotatedmarker'
import { createGlobalStyle } from 'styled-components'
import { FunctionComponent, useEffect, useState } from 'react'
import { panoHeadingParam } from '../../query-params'
import useParam from '../../../../utils/useParam'

const PAWN_CLASS = 'pawnIcon'

const orientationIcon = new Icon({
  iconUrl: '/assets/images/map/panorama-orientation.svg',
  iconSize: [70, 70],
  iconAnchor: [35, 35],
})

const pawnIcon = new Icon({
  iconUrl: '/assets/images/map/panorama-person.svg',
  iconSize: [18, 31],
  iconAnchor: [9, 22],
  className: PAWN_CLASS,
})

const GlobalStyle = createGlobalStyle`
  .${PAWN_CLASS} {
    z-index: 1000 !important;
  }
`

interface PanoramaViewerMarkerProps {
  position: LatLngLiteral | null
}

const PanoramaViewerMarker: FunctionComponent<PanoramaViewerMarkerProps> = ({ position }) => {
  const [orientationMarker, setOrientationMarker] = useState<LeafletMarker>()
  const [panoHeading] = useParam(panoHeadingParam)

  useEffect(() => {
    if (orientationMarker && panoHeading) {
      orientationMarker.setRotationAngle(panoHeading)
    }
  }, [orientationMarker, panoHeading])

  return position ? (
    <>
      <GlobalStyle />
      <Marker
        setInstance={setOrientationMarker}
        latLng={position}
        options={{ icon: orientationIcon }}
      />
      <Marker latLng={position} options={{ icon: pawnIcon }} />
    </>
  ) : null
}

export default PanoramaViewerMarker
