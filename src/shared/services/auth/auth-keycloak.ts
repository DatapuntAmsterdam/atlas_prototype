import Keycloak from 'keycloak-js'
import environment from '../../../environment'

const keycloak = Keycloak({
  url: environment.KEYCLOAK_URL,
  realm: environment.KEYCLOAK_REALM,
  clientId: environment.KEYCLOAK_CLIENT,
})

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
  const rolesByResource = Object.values(keycloak.resourceAccess ?? {})
  const roles = rolesByResource.flatMap((resource) => resource.roles)

  return roles
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
  return keycloak.authenticated ?? false
}
