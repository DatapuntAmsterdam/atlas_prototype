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
    ? { iconLeft: <MapLayers /> }
    : { icon: <MapLayers />, size: 32 }

  return (
    <Control>
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
