import { themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled, { css } from 'styled-components'
import { DeviceMode, isMobile } from '../DrawerOverlay'

const STACK_SPACING = 8

export interface DrawerPanelProps {
  stackLevel?: number
  deviceMode?: DeviceMode
}

const DrawerPanel = styled.div<DrawerPanelProps>`
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  overflow-y: auto;
  animation: slidein 0.25s ease-in-out;
  background-color: ${themeColor('tint', 'level1')};

  ${({ deviceMode = DeviceMode.Mobile, stackLevel = 0 }) => {
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

  ${({ deviceMode = DeviceMode.Mobile }) =>
    isMobile(deviceMode)
      ? css`
          @keyfames slidein {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }
        `
      : css`
          @keyfames slidein {
            from {
              transform: translateX(-100%);
            }
            to {
              transform: translateX(0);
            }
          }
        `}
`

export default DrawerPanel
