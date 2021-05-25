import type { FunctionComponent } from 'react'
import { useCallback } from 'react'
import { MapLayers } from '@amsterdam/asc-assets'
import { Button } from '@amsterdam/asc-ui'
import styled from 'styled-components'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import Control from '../Control'
import { useMapContext } from '../../MapContext'
import { DrawerState } from '../DrawerOverlay'
import { LEGEND_OPEN } from '../../matomo-events'

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
  const { trackEvent } = useMatomo()

  const onOpenLegend = useCallback(() => {
    trackEvent(LEGEND_OPEN)
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
