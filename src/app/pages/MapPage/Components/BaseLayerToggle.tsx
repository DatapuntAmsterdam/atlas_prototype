import { BaseLayerToggle as BaseLayerToggleComponent } from '@datapunt/arm-core'
import { BaseLayerType } from '@datapunt/arm-core/lib/components/BaseLayerToggle'
import React, { useContext } from 'react'
import MapContext from '../MapContext'

type Props = {}

const BaseLayerToggle: React.FC<Props> = () => {
  const { setActiveBaseLayer, activeBaseLayer } = useContext(MapContext)

  return (
    <BaseLayerToggleComponent
      activeLayer={activeBaseLayer as BaseLayerType} // TODO: Should take the id instead of the type
      onChangeLayer={(id) => setActiveBaseLayer(id)}
    />
  )
}

export default BaseLayerToggle
