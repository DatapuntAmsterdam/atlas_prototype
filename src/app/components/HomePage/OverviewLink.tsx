import { breakpoint, Link, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'
import { FunctionComponent } from 'react'
import { NormalizedFieldItems } from '../../../normalizations/cms/types'

const StyledLink = styled(Link)`
  margin-top: ${themeSpacing(4)};
  padding: ${themeSpacing(2, 1, 2)} 0;

  @media screen and ${breakpoint('min-width', 'tabletM')} {
    margin-top: ${themeSpacing(6)};
  }
`

interface OverviewLinkProps extends Pick<NormalizedFieldItems, 'linkProps'> {
  label: string
}

const OverviewLink: FunctionComponent<OverviewLinkProps & Partial<HTMLAnchorElement>> = ({
  label,
  linkProps,
}) => (
  <StyledLink tabIndex={0} inList {...linkProps}>
    {label}
  </StyledLink>
)

export default OverviewLink
