import { breakpoint } from '@amsterdam/asc-ui'
import styled from 'styled-components'
import DrawerPanel from './DrawerPanel'

const SmallDrawerPanel = styled(DrawerPanel)`
  @media screen and ${breakpoint('min-width', 'tabletM')} {
    width: 460px;
  }
`

export default SmallDrawerPanel
