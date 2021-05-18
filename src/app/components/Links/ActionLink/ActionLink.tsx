import { Link } from '@amsterdam/asc-ui'
import type { FunctionComponent } from 'react'
import type { LinkProps } from 'redux-first-router-link'
import pickLinkComponent from '../../../utils/pickLinkComponent'

const ActionLink: FunctionComponent<LinkProps> = ({ to, children, ...otherProps }) => (
  <Link as={pickLinkComponent(to)} to={to} {...otherProps}>
    {children}
  </Link>
)

export default ActionLink
