import { Link } from '@amsterdam/asc-ui'
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
  inList?: boolean
}

export const LoginLink: React.FC<LoginLinkProps> = ({ inList = true, children }) => {
  const dispatch = useDispatch()
  const handleLogin = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    dispatch(authenticateRequest('inloggen'))
    login()
  }, [])

  // TODO: Since this is not a navigational element a Button should be used here.
  return (
    <StyledLink data-testid="link" inList={inList} onClick={handleLogin} darkBackground>
      {children || 'Inloggen'}
    </StyledLink>
  )
}

export default LoginLink
