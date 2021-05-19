import { useCallback } from 'react'
import { MapLayers } from '@amsterdam/asc-assets'
import { Button } from '@amsterdam/asc-ui'
import styled from 'styled-components'
import type { FunctionComponent } from 'react'
import Control from '../Control'
import { useMapContext } from '../../MapContext'
import { DrawerState } from '../DrawerOverlay'

interface LegendControlProps {
  showDesktopVariant: boolean
}

const StyledButton = styled(Button)`
  min-width: inherit;
`

const StyledControl = styled(Control)`
  align-self: flex-start;
`

const LegendControl: FunctionComponent<LegendControlProps> = ({ showDesktopVariant }) => {
  const { setLegendActive, setDrawerState } = useMapContext()
  const onOpenLegend = useCallback(() => {
    setLegendActive(true)
    setDrawerState(DrawerState.Open)
  }, [])
  const iconProps = showDesktopVariant
    ? { iconLeft: <MapLayers data-testid="desktopIcon" /> }
    : { icon: <MapLayers data-testid="mobileIcon" />, size: 32 }

  return (
    <StyledControl data-testid="legendControl">
      <StyledButton
        type="button"
        variant="blank"
        title="Legenda"
        iconSize={20}
        onClick={onOpenLegend}
        {...iconProps}
      >
        Legenda
      </StyledButton>
    </StyledControl>
  )
}

export default LegendControl
