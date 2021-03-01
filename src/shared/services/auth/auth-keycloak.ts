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
  keycloak.login()
}

export function logout() {
  keycloak.logout()
}

export function initAuth() {
  keycloak.init({
    checkLoginIframe: false,
    pkceMethod: 'S256',
    onLoad: 'check-sso',
  })
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
  return keycloak.profile?.firstName ?? ''
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
