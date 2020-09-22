import { BaseLayerToggle as BaseLayerToggleComponent } from '@amsterdam/arm-core'
import React, { useMemo } from 'react'
import { getMapBaseLayers, MapBaseLayer } from '../../../../map/services'
import useParam from '../../../utils/useParam'
import { BaseLayer, baseLayerParam } from '../query-params'

const aerialLayers = getMapBaseLayers()
  .filter(({ category }) => category === 'aerial')
  .map((baseLayer) => toMapLayer(baseLayer))

const topoLayers = getMapBaseLayers()
  .filter(({ category }) => category === 'topography')
  .map((baseLayer) => toMapLayer(baseLayer))

// TODO: Use the 'MapLayer' type when exported by ARM, see: https://github.com/Amsterdam/amsterdam-react-maps/issues/728
function toMapLayer({ value, urlTemplate, label }: MapBaseLayer) {
  return {
    id: value,
    urlTemplate,
    label,
  }
}

const topoIds = topoLayers.map(({ id }) => id)
const aerialIds = aerialLayers.map(({ id }) => id)

// TODO: Refactor BaseLayerToggle to use an object instead of array of MapBaseLayers
const BaseLayerToggle: React.FC = () => {
  const [activeBaseLayer, setActiveBaseLayer] = useParam(baseLayerParam)

  const aerialIndex = useMemo(
    () => (aerialIds.includes(activeBaseLayer) && aerialIds.indexOf(activeBaseLayer)) || 0,
    [activeBaseLayer],
  )

  const topoIndex = useMemo(
    () => (topoIds.includes(activeBaseLayer) && topoIds.indexOf(activeBaseLayer)) || 0,
    [activeBaseLayer],
  )

  return (
    <BaseLayerToggleComponent
      aerialLayers={aerialLayers}
      topoLayers={topoLayers}
      aerialDefaultIndex={aerialIndex}
      topoDefaultIndex={topoIndex}
      // @ts-ignore
      activeLayer={
        activeBaseLayer && aerialIds.indexOf(activeBaseLayer) > topoIds.indexOf(activeBaseLayer)
          ? 'luchtfoto'
          : 'topografie'
      } // TODO: Should take the id instead of the type
      onChangeLayer={(id) => {
        setActiveBaseLayer(id as BaseLayer, 'replace')
      }}
    />
  )
}

export default BaseLayerToggle
