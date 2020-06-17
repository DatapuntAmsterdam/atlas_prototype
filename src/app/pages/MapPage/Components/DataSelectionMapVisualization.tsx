import React, { useContext } from 'react'
import { MarkerClusterGroup } from '@datapunt/arm-cluster'
import GeoJSON from './GeoJSON'
import DataSelectionContext from '../DataSelectionContext'
import { DataSelectionMapVisualizationType } from './config'
import geoJsonConfig from '../../../../map/components/leaflet/services/geo-json-config.constant'

const DataSelectionMapVisualization = () => {
  const { mapVisualization } = useContext(DataSelectionContext)

  return (
    <>
      {mapVisualization.length
        ? mapVisualization.map(({ data, id, type }) => {
            if (type === DataSelectionMapVisualizationType.GeoJSON)
              return data.map((feature) => (
                <GeoJSON
                  geometry={feature}
                  key={`${id}_${feature.name}`}
                  options={{
                    // Todo: move geoJsonConfig to new dataselection config.ts when legacy map is removed
                    style: geoJsonConfig[feature.name as any]?.style,
                  }}
                  setInstance={(geoJsonLayer) => {
                    geoJsonLayer.bringToBack()
                  }}
                />
              ))
            if (type === DataSelectionMapVisualizationType.Markers) {
              return <MarkerClusterGroup key={id} markers={data.map(({ latLng }) => latLng)} />
            }
            return null
          })
        : null}
    </>
  )
}

export default DataSelectionMapVisualization
