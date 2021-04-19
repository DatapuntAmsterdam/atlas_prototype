import { LatLngLiteral } from 'leaflet'
import { FunctionComponent, useMemo } from 'react'
import { matchPath, useLocation } from 'react-router-dom'
import PanoramaViewerMarker from '../../components/PanoramaViewer/PanoramaViewerMarker'
import useParam from '../../utils/useParam'
import MapSearchMarker from './map-search/MapSearchMarker'
import { drawToolOpenParam, locationParam } from './query-params'
import { routing } from '../../routes'

export interface MarkerProps {
  location: LatLngLiteral | null
  setLocation?: (location: LatLngLiteral) => void
}

export interface MapMarkersProps {
  panoActive: boolean
}

const MapMarkers: FunctionComponent<MapMarkersProps> = ({ panoActive }) => {
  const [locationParameter, setLocationParameter] = useParam(locationParam)
  const location = useLocation()
  const [showDrawTool] = useParam(drawToolOpenParam)

  const showSearchMarker = useMemo(
    () =>
      !panoActive &&
      !showDrawTool &&
      (matchPath(location.pathname, { path: routing.dataSearchGeo_TEMP.path, exact: true }) ||
        matchPath(location.pathname, { path: routing.data_TEMP.path, exact: true })),
    [location, panoActive, showDrawTool],
  )

  return (
    <>
      {showSearchMarker && <MapSearchMarker location={locationParameter} />}
      {panoActive && (
        <PanoramaViewerMarker location={locationParameter} setLocation={setLocationParameter} />
      )}
    </>
  )
}

export default MapMarkers
