import { Link, styles, svgFill, themeColor } from '@amsterdam/asc-ui'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components'

const StyledLink = styled(Link)`
  color: ${themeColor('primary')};
  cursor: pointer;

  ${styles.IconStyle} {
    ${svgFill(themeColor('primary'))}
  }
`

const SearchLink = ({ to, label, title = '' }) => (
  <StyledLink inList forwardedAs={RouterLink} to={to} title={title || label}>
    {label}
  </StyledLink>
)

export default SearchLink
