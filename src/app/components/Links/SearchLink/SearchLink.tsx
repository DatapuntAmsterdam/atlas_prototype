import { Link, styles, svgFill, themeColor } from '@amsterdam/asc-ui'
import { LocationDescriptor } from 'history'
import { FunctionComponent } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { To } from 'redux-first-router-link'
import styled from 'styled-components'

const StyledLink = styled(Link)`
  color: ${themeColor('primary')};
  cursor: pointer;

  ${styles.IconStyle} {
    ${svgFill(themeColor('primary'))}
  }
`

export interface SearchLinkProps {
  // TODO: Drop redux-first-router type once no longer in use.
  to: LocationDescriptor | To
  label: string
  title?: string
}

const SearchLink: FunctionComponent<SearchLinkProps> = ({ to, label, title = '' }) => (
  <StyledLink inList forwardedAs={RouterLink} to={to} title={title || label}>
    {label}
  </StyledLink>
)

export default SearchLink
