import * as authLegacy from './auth-legacy'
import * as authKeycloak from './auth-keycloak'
import { isFeatureEnabled, FEATURE_KEYCLOAK_AUTH } from '../../../app/features'

export { SCOPES, dcatdScopes } from './auth-legacy'
export const { initAuth } = authLegacy

const useKeycloak = isFeatureEnabled(FEATURE_KEYCLOAK_AUTH)

export const getAccessToken = useKeycloak ? authKeycloak.getAccessToken : authLegacy.getAccessToken
export const login = useKeycloak ? authKeycloak.login : authLegacy.login
export const logout = useKeycloak ? authKeycloak.logout : authLegacy.logout
export const getReturnPath = useKeycloak ? authKeycloak.getReturnPath : authLegacy.getReturnPath
export const getScopes = useKeycloak ? authKeycloak.getScopes : authLegacy.getScopes
export const getName = useKeycloak ? authKeycloak.getName : authLegacy.getName
export const getAuthHeaders = useKeycloak ? authKeycloak.getAuthHeaders : authLegacy.getAuthHeaders
export const isAuthenticated = useKeycloak
  ? authKeycloak.isAuthenticated
  : authLegacy.isAuthenticated
