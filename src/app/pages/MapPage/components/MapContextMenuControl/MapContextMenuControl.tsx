import { FunctionComponent } from 'react'
import styled from 'styled-components'
import Control from '../Control'
import BaseLayerToggle from '../BaseLayerToggle'
import MapContextMenu from '../MapContextMenu/MapContextMenu'

const StyledControl = styled(Control)`
  order: 3;
  display: inline-flex;
  align-self: flex-start;
  @media print {
    display: none;
  }
`

const MapContextMenuControl: FunctionComponent = () => {
  return (
    <StyledControl data-testid="mapContextMenuControls">
      <BaseLayerToggle />
      <MapContextMenu />
    </StyledControl>
  )
}

export default MapContextMenuControl
