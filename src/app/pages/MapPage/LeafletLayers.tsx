import React, { useContext, useMemo } from 'react'
import { TileLayer } from '@datapunt/react-maps'
import { NonTiledLayer } from '@datapunt/arm-nontiled'
import MapContext, { TmsOverlay, WmsOverlay } from './MapContext'
import GeoJSON from '../../components/LeafletComponents/GeoJSON'
import DrawMapVisualization from './draw/DrawMapVisualization'

const LeafletLayers: React.FC<{ setIsLoading: Function }> = ({ setIsLoading }) => {
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
      {geometry && <GeoJSON geometry={geometry} />}
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
