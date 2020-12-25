import { Link } from '@amsterdam/asc-ui'
import { FunctionComponent } from 'react'
import RouterLink, { LinkProps } from 'redux-first-router-link'

const ActionLink: FunctionComponent<LinkProps> = ({ to, children, ...otherProps }) => (
  <Link as={RouterLink} to={to} {...otherProps}>
    {children}
  </Link>
)

export default ActionLink
