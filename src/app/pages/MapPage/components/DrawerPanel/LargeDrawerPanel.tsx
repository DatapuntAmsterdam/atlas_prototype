import { breakpoint } from '@amsterdam/asc-ui'
import styled from 'styled-components'
import DrawerPanel from './DrawerPanel'

const LargeDrawerPanel = styled(DrawerPanel)`
  @media screen and ${breakpoint('min-width', 'tabletM')} {
    width: 356px;
  }

  @media screen and ${breakpoint('min-width', 'laptop')} {
    width: 596px;
  }

  @media screen and ${breakpoint('min-width', 'laptopL')} {
    width: 756px;
  }
`

export default LargeDrawerPanel
