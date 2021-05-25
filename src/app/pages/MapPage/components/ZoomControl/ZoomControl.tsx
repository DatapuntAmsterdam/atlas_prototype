import { Enlarge, Minimise } from '@amsterdam/asc-assets'
import { Button } from '@amsterdam/asc-ui'
import { useMapInstance } from '@amsterdam/react-maps'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import styled from 'styled-components'
import type { FunctionComponent } from 'react'
import Control from '../Control'
import { ZOOM_IN, ZOOM_OUT } from '../../matomo-events'

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
  const { trackEvent } = useMatomo()

  return (
    <StyledControl data-testid="zoomControls">
      <ZoomButton
        type="button"
        variant="blank"
        title="Inzoomen"
        size={44}
        iconSize={20}
        onClick={() => {
          trackEvent(ZOOM_IN)
          mapInstance.zoomIn()
        }}
        icon={<Enlarge />}
      />
      <ZoomButton
        type="button"
        variant="blank"
        title="Uitzoomen"
        size={44}
        iconSize={20}
        onClick={() => {
          trackEvent(ZOOM_OUT)
          mapInstance.zoomOut()
        }}
        icon={<Minimise />}
      />
    </StyledControl>
  )
}

export default ZoomControl
