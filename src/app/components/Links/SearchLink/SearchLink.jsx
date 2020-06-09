import { Link, styles, svgFill, themeColor } from '@datapunt/asc-ui'
import React from 'react'
import RouterLink from 'redux-first-router-link'
import styled from 'styled-components'

const StyledLink = styled(Link)`
  color: ${themeColor('primary')};
  cursor: pointer;

  ${styles.IconStyle} {
    ${svgFill(themeColor('primary'))}
  }
`

const SearchLink = ({ to, label, title = '' }) => (
  <StyledLink variant="with-chevron" forwardedAs={RouterLink} to={to} title={title || label}>
    {label}
  </StyledLink>
)

export default SearchLink
