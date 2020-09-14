import React, { useContext } from 'react'
import { LatLngLiteral } from 'leaflet'
import MapSearchMarker from './map-search/MapSearchMarker'
import useParam from '../../utils/useParam'
import { locationParam } from './query-params'
import PanoramaViewerMarker from '../../components/PanoramaViewer/PanoramaViewerMarker'
import MapContext from './MapContext'

type Props = {
  panoActive: boolean
}

export type MarkerProps = {
  location: LatLngLiteral | null
  setLocation: (location: LatLngLiteral | null) => void
}

const MapMarkers: React.FC<Props> = ({ panoActive }) => {
  const [location, setLocation] = useParam(locationParam)
  const { showDrawTool } = useContext(MapContext)
  return (
    <>
      {!panoActive && !showDrawTool && <MapSearchMarker {...{ setLocation, location }} />}
      {panoActive && <PanoramaViewerMarker {...{ setLocation, location }} />}
    </>
  )
}

export default MapMarkers
