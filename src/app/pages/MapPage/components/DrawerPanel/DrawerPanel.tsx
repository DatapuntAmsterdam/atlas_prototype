import { themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled, { css, keyframes } from 'styled-components'
import { DeviceMode, isMobile } from '../DrawerOverlay'

const STACK_SPACING = 8

interface DrawerPanelProps {
  stackLevel?: number
  deviceMode?: DeviceMode
}

export const slideInMobile = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`

export const slideInDesktop = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`

// I tried to get this to work with 'defaultProps' to reduce repetition,
// but I could not come to a solution that works with Styled Components and TS.
// If you like a challenge, check out: https://github.com/microsoft/TypeScript/issues/27425
const defaultDeviceMode = DeviceMode.Mobile

const DrawerPanel = styled.div<DrawerPanelProps>`
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  overflow-y: auto;
  animation: ${({ deviceMode = defaultDeviceMode }) =>
      isMobile(deviceMode) ? slideInMobile : slideInDesktop}
    0.25s ease-in-out;
  background-color: ${themeColor('tint', 'level1')};

  ${({ deviceMode = defaultDeviceMode, stackLevel = 0 }) => {
    if (isMobile(deviceMode)) {
      return css`
        margin-top: ${themeSpacing(STACK_SPACING * stackLevel)};

        ${stackLevel > 0 &&
        css`
          box-shadow: 0 0 0 ${themeSpacing(1)} rgba(0, 0, 0, 0.1);
        `}
      `
    }

    return css`
      margin-right: ${themeSpacing(STACK_SPACING * stackLevel)};
      ${stackLevel > 0 &&
      css`
        box-shadow: 1px 0 2px 1px #00000057;
      `}
    `
  }}
`

export default DrawerPanel
