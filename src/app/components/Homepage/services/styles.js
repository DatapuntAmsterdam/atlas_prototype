import { css } from '@datapunt/asc-core'
import { themeColor } from '@datapunt/asc-ui'

export const focusOutline = (width = 4) =>
  css`
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    border: ${width}px solid ${themeColor('support', 'focus')};
  `

export default focusOutline
