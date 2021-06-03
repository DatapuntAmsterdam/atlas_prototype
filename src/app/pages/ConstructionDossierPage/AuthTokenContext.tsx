import jwtDecode from 'jwt-decode'
import type { FunctionComponent } from 'react'
import { useEffect, useState } from 'react'
import { getAccessToken } from '../../../shared/services/auth/auth'
import createNamedContext from '../../utils/createNamedContext'
import useInterval from '../../utils/useInterval'
import useParam from '../../utils/useParam'
import useRequiredContext from '../../utils/useRequiredContext'
import { authTokenParam } from './query-params'

export interface DecodedToken {
  /**
   * A Unix timestamp that indicated when the token expires.
   */
  exp: number
  /**
   * The scopes the token has access to.
   */
  scopes: string[]
  /**
   * The e-mail address of the user the token belongs to.
   */
  sub: string
}

export interface AuthTokenContextProps {
  token: string | null
  decodedToken: DecodedToken | null
  isTokenExpired: boolean
}

const AuthTokenContext = createNamedContext<AuthTokenContextProps | null>('AuthToken', null)

export default AuthTokenContext

const STORAGE_KEY = 'AUTH_TOKEN'
const EXPIRE_SKEW = 60 * 1000

function decodeToken(token: string) {
  try {
    return jwtDecode<DecodedToken>(token)
  } catch (e) {
    return false
  }
}

function isExpired(token: DecodedToken) {
  const expiresAt = token.exp * 1000 - EXPIRE_SKEW

  return Date.now() > expiresAt
}

const DEFAULT_VALUE: AuthTokenContextProps = {
  token: null,
  decodedToken: null,
  isTokenExpired: false,
}

const AuthTokenProvider: FunctionComponent = ({ children }) => {
  const [tokenParam, setTokenParam] = useParam(authTokenParam)
  const [value, setValue] = useState<AuthTokenContextProps>(() => {
    // Use the token from the url or local storage.
    const token = tokenParam ?? localStorage.getItem(STORAGE_KEY)
    const decodedToken = token ? decodeToken(token) : null

    // Ignore tokens that are empty.
    if (!decodedToken) {
      return DEFAULT_VALUE
    }

    // Return empty token with expiry status if expired.
    if (isExpired(decodedToken)) {
      return { ...DEFAULT_VALUE, isTokenExpired: true }
    }

    // Otherwise return a valid token.
    return { token, decodedToken, isTokenExpired: false }
  })

  // Keep the value of the token in sync with local storage.
  useEffect(() => {
    if (value.token) {
      localStorage.setItem(STORAGE_KEY, value.token)
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [value.token])

  // Clear the token from the URL if present.
  useEffect(() => {
    if (tokenParam) {
      setTokenParam(null, 'replace')
    }
  }, [tokenParam])

  function checkExpiry() {
    // Don't do anything if we have a non-expired token.
    if (!value.decodedToken || !isExpired(value.decodedToken)) {
      return
    }

    // Otherwise clear the token and set the correct expiry status.
    setValue({
      token: null,
      decodedToken: null,
      isTokenExpired: true,
    })
  }

  // Periodically check if token has expired.
  useInterval(checkExpiry, 1000)

  return (
    <AuthTokenContext.Provider
      value={
        // Only provide the value if the user does not have an authenticated session.
        !getAccessToken() ? value : DEFAULT_VALUE
      }
    >
      {children}
    </AuthTokenContext.Provider>
  )
}

export { AuthTokenProvider }

export function useAuthToken() {
  return useRequiredContext(AuthTokenContext)
}
