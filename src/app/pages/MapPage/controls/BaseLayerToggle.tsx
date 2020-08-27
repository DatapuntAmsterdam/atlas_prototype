import { BaseLayerToggle as BaseLayerToggleComponent } from '@datapunt/arm-core'
import React, { useMemo } from 'react'
import mapBaseLayerConfig from '../../../../../public/static/map/map-base-layers.config.json'
import useParam from '../../../utils/useParam'
import { BaseLayer, baseLayerParam } from '../../../query-params'

type Props = {}

const aerialLayers = mapBaseLayerConfig
  .filter(({ category }) => category === 'aerial')
  .map(({ value, urlTemplate, label }) => ({
    id: value,
    urlTemplate,
    label,
  }))
const topoLayers = mapBaseLayerConfig
  .filter(({ category }) => category === 'topography')
  .map(({ value, urlTemplate, label }) => ({
    id: value,
    urlTemplate,
    label,
  }))

const topoIds = topoLayers.map(({ id }) => id)
const aerialIds = aerialLayers.map(({ id }) => id)

/**
 * Todo: Refactor BaseLayerToggle to use an object instead of array of MapBaseLayers
 */
const BaseLayerToggle: React.FC<Props> = () => {
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
