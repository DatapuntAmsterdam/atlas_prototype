import { Link } from '@amsterdam/asc-ui'
import { FunctionComponent } from 'react'
import { LinkProps } from 'redux-first-router-link'
import pickLinkComponent from '../../../utils/pickLinkComponent'

const ActionLink: FunctionComponent<LinkProps> = ({ to, children, ...otherProps }) => (
  <Link as={pickLinkComponent(to)} to={to} {...otherProps}>
    {children}
  </Link>
)

export default ActionLink
