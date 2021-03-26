import { MapLayers } from '@amsterdam/asc-assets'
import { Button } from '@amsterdam/asc-ui'
import styled from 'styled-components'
import { FunctionComponent } from 'react'
import Control from '../Control'

export interface LegendControlProps {
  showDesktopVariant: boolean
  onClick: () => void
}

const StyledButton = styled(Button)`
  min-width: inherit;
`

const LegendControl: FunctionComponent<LegendControlProps> = ({ showDesktopVariant, onClick }) => {
  const iconProps = showDesktopVariant
    ? { iconLeft: <MapLayers data-testid="desktopIcon" /> }
    : { icon: <MapLayers data-testid="mobileIcon" />, size: 32 }

  return (
    <Control data-testid="legendControl">
      <StyledButton
        type="button"
        variant="blank"
        title="Legenda"
        iconSize={20}
        onClick={onClick}
        {...iconProps}
      >
        Legenda
      </StyledButton>
    </Control>
  )
}

export default LegendControl
