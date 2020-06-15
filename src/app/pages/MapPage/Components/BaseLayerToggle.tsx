import React, { useContext } from 'react'

import { BaseLayerToggle as BaseLayerToggleComponent } from '@datapunt/arm-core'
import MapContext from '../MapContext'

type Props = {}

const BaseLayerToggle: React.FC<Props> = () => {
  const { setActiveBaseLayer, activeBaseLayer } = useContext(MapContext)

  return (
    <BaseLayerToggleComponent
      activeLayer={activeBaseLayer} // TODO: Should take the id instead of the type
      onChangeLayer={(id) => setActiveBaseLayer(id)}
    />
  )
}

export default BaseLayerToggle
