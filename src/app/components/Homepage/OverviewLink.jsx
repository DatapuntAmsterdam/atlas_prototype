import styled from '@datapunt/asc-core'
import { breakpoint, Link, themeSpacing } from '@datapunt/asc-ui'
import React from 'react'

const StyledLink = styled(Link)`
  margin-top: ${themeSpacing(4)};
  padding: ${themeSpacing(2, 1, 2)} 0;

  @media screen and ${breakpoint('min-width', 'tabletM')} {
    margin-top: ${themeSpacing(6)};
  }
`

const OverviewLink = ({ label, href }) => (
  <StyledLink linkType="with-chevron" href={href}>
    {label}
  </StyledLink>
)

export default OverviewLink
