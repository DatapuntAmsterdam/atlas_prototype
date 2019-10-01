import React from 'react'
import { Link } from '@datapunt/asc-ui'
import RouterLink from 'redux-first-router-link'

const ActionLink = ({ to, children, ...otherProps }) => (
  <Link $as={RouterLink} to={to} {...otherProps}>
    {children}
  </Link>
)

export default ActionLink
