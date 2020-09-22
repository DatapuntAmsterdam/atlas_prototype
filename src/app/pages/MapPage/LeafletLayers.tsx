import { NonTiledLayer } from '@amsterdam/arm-nontiled'
import { GeoJSON, TileLayer } from '@amsterdam/react-maps'
import { BaseIconOptions, GeoJSONOptions, Icon, Marker } from 'leaflet'
import React, { useContext, useMemo } from 'react'
import ICON_CONFIG from '../../../map/components/leaflet/services/icon-config.constant'
import MAP_CONFIG from '../../../map/services/map.config'
import DrawMapVisualization from './draw/DrawMapVisualization'
import MapContext, { TmsOverlay, WmsOverlay } from './MapContext'

const detailGeometryStyle = {
  color: 'red',
  fillColor: 'red',
  weight: 2,
  opacity: 1.6,
  fillOpacity: 0.2,
}

const detailGeometryOptions: GeoJSONOptions = {
  style: detailGeometryStyle,
  pointToLayer(feature, latLng) {
    const icon = new Icon(ICON_CONFIG.DETAIL as BaseIconOptions)

    return new Marker(latLng, {
      icon,
      alt: 'Locatie van detailweergave',
    })
  },
}

const LeafletLayers: React.FC = () => {
  const { legendLeafletLayers, detailFeature, showDrawContent } = useContext(MapContext)
  const tmsLayers = useMemo(
    () => legendLeafletLayers.filter((overlay): overlay is TmsOverlay => overlay.type === 'tms'),
    [legendLeafletLayers],
  )

  const wmsLayers = useMemo(
    () => legendLeafletLayers.filter((overlay): overlay is WmsOverlay => overlay.type === 'wms'),
    [legendLeafletLayers],
  )

  return (
    <>
      {showDrawContent && <DrawMapVisualization />}
      {detailFeature && (
        <GeoJSON
          key={detailFeature.id}
          args={[detailFeature]}
          options={detailGeometryOptions}
          setInstance={(layer) => layer.bringToBack()}
        />
      )}
      {tmsLayers.map(({ id, url, options }) => (
        <TileLayer
          key={id}
          args={[url]}
          // @ts-ignore
          options={{
            ...MAP_CONFIG.BASE_LAYER_OPTIONS,
            ...options,
          }}
        />
      ))}
      {wmsLayers.map(({ url, options, id, params }) => (
        <NonTiledLayer key={id} url={url} options={options} params={params} />
      ))}
    </>
  )
}

export default LeafletLayers
