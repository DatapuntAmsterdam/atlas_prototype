import { Feature } from 'geojson'
import { LatLngTuple } from 'leaflet'
import { FunctionComponent, useState } from 'react'
import { DataSelectionMapVisualizationType } from '../../config'
import DataSelectionContext from './DataSelectionContext'

interface NamedFeature extends Feature {
  name: string
}

interface MapVisualizationGeoJSON {
  id: string
  type: DataSelectionMapVisualizationType.GeoJSON
  data: NamedFeature[]
}

export interface Marker {
  id: string
  latLng: LatLngTuple
}

export interface MapVisualizationMarkers {
  id: string
  type: DataSelectionMapVisualizationType.Markers
  data: Marker[]
}

export type MapVisualization = MapVisualizationGeoJSON | MapVisualizationMarkers

type DataSelectionResult = Array<{
  id: string
  name: string
  marker?: Marker
}>

export interface DataSelectionResponse {
  totalCount: number
  results: DataSelectionResult
}

const DataSelectionProvider: FunctionComponent = ({ children }) => {
  const [distanceText, setDistanceText] = useState<string>()

  return (
    <DataSelectionContext.Provider
      value={{
        setDistanceText,
        distanceText,
      }}
    >
      {children}
    </DataSelectionContext.Provider>
  )
}

export default DataSelectionProvider
