import { breakpoint, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

const TileLabel = styled.div`
  padding: ${themeSpacing(2, 3)};
  background-color: ${themeColor('tint', 'level1')};
  position: absolute;
  bottom: 56px;
  left: 0;
  max-width: calc(100% - 44px);
  word-break: break-word;

  @media screen and ${breakpoint('min-width', 'tabletM')} {
    padding: ${themeSpacing(4)};
  }
`

export default TileLabel
