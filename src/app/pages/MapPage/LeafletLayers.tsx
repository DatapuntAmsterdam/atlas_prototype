import { NonTiledLayer } from '@amsterdam/arm-nontiled'
import { GeoJSON, TileLayer } from '@amsterdam/react-maps'
import { BaseIconOptions, GeoJSONOptions, Icon, Marker, GeoJSON as GeoJSONType } from 'leaflet'
import { FunctionComponent, useMemo } from 'react'
import ICON_CONFIG from '../../../map/components/leaflet/services/icon-config.constant'
import MAP_CONFIG from '../../../map/services/map.config'
import { TmsOverlay, useMapContext, WmsOverlay } from './MapContext'
import DrawMapVisualization from './components/DrawTool/DrawMapVisualization'
import useMapCenterToMarker from '../../utils/useMapCenterToMarker'

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

const LeafletLayers: FunctionComponent = () => {
  const { legendLeafletLayers, detailFeature } = useMapContext()
  const { panToWithPanelOffset } = useMapCenterToMarker()
  const tmsLayers = useMemo(
    () => legendLeafletLayers.filter((overlay): overlay is TmsOverlay => overlay.type === 'tms'),
    [legendLeafletLayers],
  )

  const wmsLayers = useMemo(
    () => legendLeafletLayers.filter((overlay): overlay is WmsOverlay => overlay.type === 'wms'),
    [legendLeafletLayers],
  )

  /**
   * Center the map and zoom in to the detail object
   * @param layer
   */
  const handleDetailFeatureOnLoad = (layer: GeoJSONType<any>) => {
    panToWithPanelOffset(layer.getBounds())
    layer.bringToBack()
  }

  return (
    <>
      <DrawMapVisualization />
      {detailFeature && (
        <GeoJSON
          key={detailFeature.id}
          args={[detailFeature]}
          options={detailGeometryOptions}
          setInstance={handleDetailFeatureOnLoad}
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
