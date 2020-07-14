import { MarkerClusterGroup } from '@datapunt/arm-cluster'
import React, { useContext } from 'react'
import geoJsonConfig from '../../../../map/components/leaflet/services/geo-json-config.constant'
import DataSelectionContext from '../DataSelectionContext'
import { DataSelectionMapVisualizationType } from './config'
import GeoJSON from './GeoJSON'

const DataSelectionMapVisualization = () => {
  const { mapVisualizations } = useContext(DataSelectionContext)

  return (
    <>
      {mapVisualizations.map((mapVisualization) => {
        switch (mapVisualization.type) {
          case DataSelectionMapVisualizationType.GeoJSON:
            return mapVisualization.data.map((feature) => (
              <GeoJSON
                geometry={feature.geometry}
                key={`${mapVisualization.id}_${feature.name}`}
                options={{
                  // Todo: move geoJsonConfig to new dataselection config.ts when legacy map is removed
                  style: geoJsonConfig[feature.name as any]?.style,
                }}
                onAdd={(geoJsonLayer) => {
                  geoJsonLayer.bringToBack()
                }}
              />
            ))
          case DataSelectionMapVisualizationType.Markers:
            return (
              <MarkerClusterGroup
                key={mapVisualization.id}
                markers={mapVisualization.data.map(({ latLng }) => latLng)}
              />
            )
          default:
            return null
        }
      })}
    </>
  )
}

export default DataSelectionMapVisualization
