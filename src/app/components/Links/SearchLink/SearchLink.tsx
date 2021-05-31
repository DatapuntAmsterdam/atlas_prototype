import { Link, styles, svgFill, themeColor } from '@amsterdam/asc-ui'
import styled from 'styled-components'
import { Link as RouterLink } from 'react-router-dom'
import type { LocationDescriptorObject } from 'history'
import type { FunctionComponent } from 'react'

const StyledLink = styled(Link)`
  color: ${themeColor('primary')};
  cursor: pointer;

  ${styles.IconStyle} {
    ${svgFill(themeColor('primary'))}
  }
`

export interface SearchLinkProps {
  to: LocationDescriptorObject | string
  label: string
  title?: string
}

const SearchLink: FunctionComponent<SearchLinkProps> = ({ to, label, title = '' }) => (
  <StyledLink
    data-testid="searchLink"
    inList
    forwardedAs={RouterLink}
    to={to}
    title={title || label}
  >
    {label}
  </StyledLink>
)

export default SearchLink
