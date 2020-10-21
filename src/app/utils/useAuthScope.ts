import { useSelector } from 'react-redux'
import { getUserScopes } from '../../shared/ducks/user/user'
import AuthScope from '../../shared/services/api/authScope'

const useAuthScope = () => {
  const userScopes = useSelector(getUserScopes)
  const isUserAuthorized = (authScopes?: AuthScope[]) =>
    authScopes
      ? authScopes.every((scope) => (userScopes.length ? userScopes.includes(scope) : false))
      : true

  return {
    isUserAuthorized,
  }
}

export default useAuthScope
