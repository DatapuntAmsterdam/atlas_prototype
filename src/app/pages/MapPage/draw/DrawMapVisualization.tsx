import { createClusterMarkers, MarkerClusterGroup } from '@amsterdam/arm-cluster'
import { GeoJSON } from '@amsterdam/react-maps'
import React, { useContext } from 'react'
import geoJsonConfig from '../../../../map/components/leaflet/services/geo-json-config.constant'
import { DataSelectionMapVisualizationType } from '../config'
import DataSelectionContext from './DataSelectionContext'

const DrawMapVisualization: React.FC = () => {
  const { mapVisualizations } = useContext(DataSelectionContext)

  return (
    <>
      {mapVisualizations.map((mapVisualization) => {
        switch (mapVisualization.type) {
          case DataSelectionMapVisualizationType.GeoJSON:
            return mapVisualization.data.map((feature) => (
              <GeoJSON
                args={[feature.geometry]}
                key={`${mapVisualization.id}_${feature.name}`}
                options={{
                  // TODO: move geoJsonConfig to new dataselection config.ts when legacy map is removed
                  style: geoJsonConfig[feature.name as any]?.style,
                }}
                setInstance={(layer) => layer.bringToBack()}
              />
            ))
          case DataSelectionMapVisualizationType.Markers:
            return (
              <MarkerClusterGroup
                key={mapVisualization.id}
                markers={createClusterMarkers({
                  markers: mapVisualization.data.map(({ latLng }) => latLng),
                })}
              />
            )
          default:
            return null
        }
      })}
    </>
  )
}

export default DrawMapVisualization
