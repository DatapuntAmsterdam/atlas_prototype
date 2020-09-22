import { breakpoint, Heading, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

const BlockHeading = styled(Heading)`
  width: 100%;

  @media screen and ${breakpoint('max-width', 'laptopL')} {
    margin-bottom: ${themeSpacing(4)};
  }

  @media screen and ${breakpoint('min-width', 'laptopL')} {
    margin-bottom: ${themeSpacing(6)};
  }
`

export default BlockHeading
