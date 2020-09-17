import { LatLngLiteral } from 'leaflet'
import React, { useContext } from 'react'
import PanoramaViewerMarker from '../../components/PanoramaViewer/PanoramaViewerMarker'
import useParam from '../../utils/useParam'
import MapSearchMarker from './map-search/MapSearchMarker'
import MapContext from './MapContext'
import { locationParam } from './query-params'

export interface MarkerProps {
  location: LatLngLiteral | null
  setLocation: (location: LatLngLiteral | null) => void
}

export interface MapMarkersProps {
  panoActive: boolean
}

const MapMarkers: React.FC<MapMarkersProps> = ({ panoActive }) => {
  const [location, setLocation] = useParam(locationParam)
  const { showDrawTool } = useContext(MapContext)

  return (
    <>
      {!panoActive && !showDrawTool && (
        <MapSearchMarker location={location} setLocation={setLocation} />
      )}
      {panoActive && <PanoramaViewerMarker location={location} setLocation={setLocation} />}
    </>
  )
}

export default MapMarkers
