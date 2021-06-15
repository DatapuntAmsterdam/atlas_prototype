import { SCOPES } from '../../../../shared/services/auth/auth'

const hasUserRights = (
  restricted: boolean,
  scopes: Array<string>,
  token: string | null,
  isTokenExpired: boolean,
) => {
  if (restricted) {
    return scopes.includes(SCOPES['BD/X'])
  }

  return scopes.includes(SCOPES['BD/R']) || (token && !isTokenExpired)
}

export default hasUserRights
