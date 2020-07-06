import { Link } from '@datapunt/asc-ui'
import { LinkVariant } from '@datapunt/asc-ui/lib/components/Link/LinkStyle'
import React, { MouseEvent, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { authenticateRequest } from '../../../../shared/ducks/user/user'
import { login } from '../../../../shared/services/auth/auth'

const StyledLink = styled(Link)`
  &:hover {
    cursor: pointer;
  }
`

export interface LoginLinkProps {
  variant?: LinkVariant
}

export const LoginLink: React.FC<LoginLinkProps> = ({ variant = 'with-chevron', children }) => {
  const dispatch = useDispatch()
  const handleLogin = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    dispatch(authenticateRequest('inloggen'))
    login()
  }, [])

  // TODO: Since this is not a navigational element a Button should be used here.
  return (
    <StyledLink data-testid="link" variant={variant} onClick={handleLogin} darkBackground>
      {children || 'Inloggen'}
    </StyledLink>
  )
}

export default LoginLink
