import { useMemo } from 'react'
import type { LatLngLiteral } from 'leaflet'
import type { FunctionComponent } from 'react'
import PanoramaViewerMarker from './components/PanoramaViewer/PanoramaViewerMarker'
import useParam from '../../utils/useParam'
import MapSearchMarker from './map-search/MapSearchMarker'
import { locationParam } from './query-params'
import { useDataSelection } from '../../components/DataSelection/DataSelectionContext'

export interface MarkerProps {
  position: LatLngLiteral | null
  setPosition?: (location: LatLngLiteral) => void
}

export interface MapMarkersProps {
  panoActive: boolean
}

const MapMarkers: FunctionComponent<MapMarkersProps> = ({ panoActive }) => {
  const [locationParameter, setLocationParameter] = useParam(locationParam)
  const { drawToolLocked } = useDataSelection()

  const renderSearchMarker = useMemo(
    () => !drawToolLocked && !panoActive,
    [drawToolLocked, panoActive],
  )

  return (
    <>
      {renderSearchMarker && <MapSearchMarker position={locationParameter} />}
      {panoActive && (
        <PanoramaViewerMarker position={locationParameter} setPosition={setLocationParameter} />
      )}
    </>
  )
}

export default MapMarkers
