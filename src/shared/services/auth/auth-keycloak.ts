import Keycloak from 'keycloak-js'
import environment from '../../../environment'

const keycloak = Keycloak({
  url: environment.KEYCLOAK_URL,
  realm: environment.KEYCLOAK_REALM,
  clientId: environment.KEYCLOAK_CLIENT,
})

const MIN_VALIDITY = 5

keycloak.onTokenExpired = async () => {
  try {
    await keycloak.updateToken(MIN_VALIDITY)
  } catch (error) {
    // For some reason the token could not be updated.
  }
}

export function getAccessToken() {
  return keycloak.token ?? ''
}

export function login() {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  keycloak.login()
}

export function logout() {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  keycloak.logout()
}

export async function initKeycloak() {
  // For more information about these options consult the documentation:
  // https://www.keycloak.org/docs/latest/securing_apps/#_javascript_adapter
  const authenticated = await keycloak.init({
    checkLoginIframe: false,
    pkceMethod: 'S256',
    onLoad: 'check-sso',
  })

  if (authenticated) {
    await keycloak.loadUserInfo()
  }

  return authenticated
}

export function getReturnPath() {
  return ''
}

export function getScopes() {
  const realmRoles = keycloak.realmAccess?.roles ?? []
  const resourceRoles = Object.values(keycloak.resourceAccess ?? {}).flatMap(
    (resource) => resource.roles,
  )

  // The roles returned from Keycloak use a different format than AuthZ, so we have to convert them to match the ones we use in our application.
  // For example: 'brk_ro' will have to be converted to 'BRK/RO'.
  // TODO: Once we enable Keycloak by default we need to change our enums to match this new convention and remove this conversion code.
  return [...realmRoles, ...resourceRoles].map((role) => role.toUpperCase().replace('_', '/'))
}

export function getName() {
  if (!keycloak.userInfo) {
    return ''
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { preferred_username, given_name } = keycloak.userInfo as any

  if (typeof preferred_username === 'string') {
    return preferred_username
  }

  if (typeof given_name === 'string') {
    return given_name
  }

  return ''
}

export const getAuthHeaders = () => {
  if (!isAuthenticated() || !keycloak.token) {
    return {}
  }

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  return { Authorization: `Bearer ${getAccessToken()}` }
}

export function isAuthenticated() {
  try {
    if (keycloak.isTokenExpired()) {
      return false
    }
  } catch (error) {
    // Unable to check if the token is expired, this means that we probably don't have a token so let's return false.
    return false
  }

  return keycloak.authenticated ?? false
}
