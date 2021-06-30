import { breakpoint } from '@amsterdam/asc-ui'
import styled from 'styled-components'
import DrawerPanel from './DrawerPanel'

export const TABLET_M_WIDTH = 356
export const LAPTOP_WIDTH = 596

const LargeDrawerPanel = styled(DrawerPanel)`
  width: ${TABLET_M_WIDTH}px;

  @media screen and ${breakpoint('min-width', 'laptopM')} {
    width: ${LAPTOP_WIDTH}px;
  }
`

export default LargeDrawerPanel
