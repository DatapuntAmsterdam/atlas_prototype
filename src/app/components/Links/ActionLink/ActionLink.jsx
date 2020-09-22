import { Link } from '@amsterdam/asc-ui'
import React from 'react'
import RouterLink from 'redux-first-router-link'

const ActionLink = ({ to, children, ...otherProps }) => (
  <Link as={RouterLink} to={to} {...otherProps}>
    {children}
  </Link>
)

export default ActionLink
