import type AuthScope from '../../shared/services/api/authScope'
import { getScopes } from '../../shared/services/auth/auth'

const useAuthScope = () => {
  const userScopes = getScopes()
  const isUserAuthorized = (authScopes?: AuthScope[]) => {
    if (!authScopes) {
      return true
    }

    return authScopes.every((scope) => userScopes.includes(scope))
  }

  return {
    isUserAuthorized,
  }
}

export default useAuthScope
