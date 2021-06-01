import type { FunctionComponent } from 'react'
import { useMemo } from 'react'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import BaseLayerToggleComponent from './BareBaseLayerToggle/BareBaseLayerToggle'
import type { MapBaseLayer } from '../../legacy/services'
import { getMapBaseLayers } from '../../legacy/services'
import useParam from '../../../../utils/useParam'
import type { BaseLayer } from '../../query-params'
import { baseLayerParam } from '../../query-params'
import { BASE_LAYER_CHANGE } from '../../matomo-events'

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
const BaseLayerToggle: FunctionComponent = () => {
  const [activeBaseLayer, setActiveBaseLayer] = useParam(baseLayerParam)
  const { trackEvent } = useMatomo()

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
        trackEvent({
          ...BASE_LAYER_CHANGE,
          name: id,
        })
        setActiveBaseLayer(id as BaseLayer, 'replace')
      }}
    />
  )
}

export default BaseLayerToggle
