import { getUserScopes, userIsAuthenticated } from '../../../shared/ducks/user/user'

const CONSTANTS = {
  DIMENSION3: {
    ID: 3,
    AUTHENTICATED: true,
    UNAUTHENTICATED: false,
  },
  DIMENSION4: {
    ID: 4,
    UNDEFINED: null,
  },
  DIMENSION5: {
    ID: 5,
    PRINT: 'print',
    EMBED: 'embed',
  },
}

// eslint-disable-next-line import/prefer-default-export
export const authCustomDimensions = (state) => {
  const authenticated = userIsAuthenticated(state)
    ? CONSTANTS.DIMENSION3.AUTHENTICATED
    : CONSTANTS.DIMENSION3.UNAUTHENTICATED
  const scopes = authenticated ? getUserScopes(state) : []

  let role = CONSTANTS.DIMENSION4.UNDEFINED
  if (scopes.length > 0) {
    role = scopes.sort().join('|')
  }

  return [
    { id: CONSTANTS.DIMENSION3.ID, value: authenticated }, // customDimension = 'Authenticated'
    { id: CONSTANTS.DIMENSION4.ID, value: role }, // customDimension = 'Role'
  ]
}
