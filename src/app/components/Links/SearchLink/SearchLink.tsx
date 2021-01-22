import { Link, styles, svgFill, themeColor } from '@amsterdam/asc-ui'
import { LocationDescriptorObject } from 'history'
import { FunctionComponent } from 'react'
import { To } from 'redux-first-router-link'
import styled from 'styled-components'
import pickLinkComponent from '../../../utils/pickLinkComponent'

const StyledLink = styled(Link)`
  color: ${themeColor('primary')};
  cursor: pointer;

  ${styles.IconStyle} {
    ${svgFill(themeColor('primary'))}
  }
`

export interface SearchLinkProps {
  // TODO: Drop redux-first-router type once no longer in use.
  to: LocationDescriptorObject | To
  label: string
  title?: string
}

const SearchLink: FunctionComponent<SearchLinkProps> = ({ to, label, title = '' }) => (
  <StyledLink inList forwardedAs={pickLinkComponent(to)} to={to} title={title || label}>
    {label}
  </StyledLink>
)

export default SearchLink
