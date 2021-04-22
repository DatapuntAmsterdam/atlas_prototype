import { FunctionComponent } from 'react'
import { Enlarge, Minimise } from '@amsterdam/asc-assets'
import { Button } from '@amsterdam/asc-ui'
import { useMapInstance } from '@amsterdam/react-maps'
import styled from 'styled-components'
import Control from '../Control'

const ZoomButton = styled(Button)`
  margin-bottom: 2px;

  &:last-of-type {
    margin-bottom: 0;
  }
`

const StyledControl = styled(Control)`
  order: 3;
  align-self: flex-end;
`

const ZoomControl: FunctionComponent = () => {
  const mapInstance = useMapInstance()

  return (
    <StyledControl data-testid="zoomControls">
      <ZoomButton
        type="button"
        variant="blank"
        title="Inzoomen"
        size={44}
        iconSize={20}
        onClick={() => mapInstance.zoomIn()}
        icon={<Enlarge />}
      />
      <ZoomButton
        type="button"
        variant="blank"
        title="Uitzoomen"
        size={44}
        iconSize={20}
        onClick={() => mapInstance.zoomOut()}
        icon={<Minimise />}
      />
    </StyledControl>
  )
}

export default ZoomControl
