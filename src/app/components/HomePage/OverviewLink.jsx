import { breakpoint, Link, themeSpacing } from '@amsterdam/asc-ui'
import React from 'react'
import styled from 'styled-components'

const StyledLink = styled(Link)`
  margin-top: ${themeSpacing(4)};
  padding: ${themeSpacing(2, 1, 2)} 0;

  @media screen and ${breakpoint('min-width', 'tabletM')} {
    margin-top: ${themeSpacing(6)};
  }
`

const OverviewLink = ({ label, linkProps }) => (
  <StyledLink tabIndex={0} inList {...linkProps}>
    {label}
  </StyledLink>
)

export default OverviewLink
