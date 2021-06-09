import { breakpoint } from '@amsterdam/asc-ui'
import styled from 'styled-components'
import DrawerPanel from './DrawerPanel'

export const TABLET_M_WIDTH = 356
export const LAPTOP_WIDTH = 596
export const LAPTOP_L_WIDTH = 756

const LargeDrawerPanel = styled(DrawerPanel)`
  @media screen and ${breakpoint('min-width', 'tabletM')} {
    width: ${TABLET_M_WIDTH}px;
  }

  @media screen and ${breakpoint('min-width', 'laptop')} {
    width: ${LAPTOP_WIDTH}px;
  }

  @media screen and ${breakpoint('min-width', 'laptopL')} {
    width: ${LAPTOP_L_WIDTH}px;
  }
`

export default LargeDrawerPanel
