import { LatLngLiteral } from 'leaflet'
import { FunctionComponent } from 'react'
import PanoramaViewerMarker from '../../components/PanoramaViewer/PanoramaViewerMarker'
import useParam from '../../utils/useParam'
import MapSearchMarker from './map-search/MapSearchMarker'
import { drawToolOpenParam, locationParam } from './query-params'

export interface MarkerProps {
  location: LatLngLiteral | null
  setLocation?: (location: LatLngLiteral) => void
}

export interface MapMarkersProps {
  panoActive: boolean
}

const MapMarkers: FunctionComponent<MapMarkersProps> = ({ panoActive }) => {
  const [location, setLocation] = useParam(locationParam)
  const [showDrawTool] = useParam(drawToolOpenParam)

  return (
    <>
      {!panoActive && !showDrawTool && <MapSearchMarker location={location} />}
      {panoActive && <PanoramaViewerMarker location={location} setLocation={setLocation} />}
    </>
  )
}

export default MapMarkers
