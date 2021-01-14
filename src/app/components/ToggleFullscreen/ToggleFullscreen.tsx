import { FunctionComponent } from 'react'
import styled, { css } from 'styled-components'
import { ControlButton } from '@amsterdam/arm-core'
import { themeSpacing } from '@amsterdam/asc-ui'
import Maximize from '../../../shared/assets/icons/icon-maximize.svg'
import Minimize from '../../../shared/assets/icons/icon-minimize.svg'

export interface ToggleFullscreenProps {
  alignLeft?: boolean
  isFullscreen: boolean
  title: string
  onToggleFullscreen: () => void
}

const StyledControlButton = styled(ControlButton)`
  position: absolute;

  top: ${themeSpacing(2)};
  z-index: 1;
  ${({ alignLeft }) =>
    alignLeft
      ? css`
          left: ${themeSpacing(2)};
        `
      : css`
          right: ${themeSpacing(2)};
        `}
`

const ToggleFullscreen: FunctionComponent<ToggleFullscreenProps> = ({
  isFullscreen,
  title,
  onToggleFullscreen,
  alignLeft,
}) => (
  <StyledControlButton
    variant="blank"
    title={isFullscreen ? `${title} verkleinen` : `${title} vergroten`}
    icon={isFullscreen ? <Minimize /> : <Maximize />}
    iconSize={28}
    size={40}
    onClick={onToggleFullscreen}
    alignLeft={alignLeft}
    extraClass="qa-toggle-fullscreen"
    className="qa-toggle-fullscreen"
  />
)

export default ToggleFullscreen
