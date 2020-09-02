import { NonTiledLayer } from '@datapunt/arm-nontiled'
import { GeoJSON, TileLayer } from '@datapunt/react-maps'
import { BaseIconOptions, GeoJSONOptions, Icon, Marker } from 'leaflet'
import React, { useContext, useMemo } from 'react'
import ICON_CONFIG from '../../../map/components/leaflet/services/icon-config.constant'
import DrawMapVisualization from './draw/DrawMapVisualization'
import MapContext, { TmsOverlay, WmsOverlay } from './MapContext'

export interface LeafletLayersProps {
  setIsLoading: (isLoading: boolean) => void
}

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

const LeafletLayers: React.FC<LeafletLayersProps> = ({ setIsLoading }) => {
  const { legendLeafletLayers, geometry, showDrawContent } = useContext(MapContext)

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
      {geometry && (
        <GeoJSON
          args={[geometry]}
          options={detailGeometryOptions}
          setInstance={(layer) => layer.bringToBack()}
        />
      )}
      {tmsLayers.map(({ options, id }) => (
        <TileLayer
          key={id}
          options={options}
          events={{
            loading: () => setIsLoading(true),
            load: () => setIsLoading(false),
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
