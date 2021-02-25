import isFeatureEnabled from '../../../app/utils/isFeatureEnabled'
import * as authLegacy from './auth-legacy'
import * as authKeycloak from './auth-keycloak'

// All the scopes this City Daty frontend needs for communication with
// the backend APIs

// Catalogus (Dcatd) admin
export const dcatdScopes = [
  'CAT/R', // Redacteursrechten
  'CAT/W', // Beheerdersrechten
]

export const SCOPES = {
  'BRK/RS': 'BRK/RS',
  'BRK/RSN': 'BRK/RSN',
  'BRK/RO': 'BRK/RO',
  'WKPB/RBDU': 'WKPB/RBDU',
  'MON/RBC': 'MON/RBC',
  'MON/RDM': 'MON/RDM',
  'HR/R': 'HR/R',
  'BD/R': 'BD/R',
  'BD/X': 'BD/X',
}

const useKeycloak = isFeatureEnabled('KEYCLOAK_AUTH')

export const getAccessToken = useKeycloak ? authKeycloak.getAccessToken : authLegacy.getAccessToken
export const login = useKeycloak ? authKeycloak.login : authLegacy.login
export const logout = useKeycloak ? authKeycloak.logout : authLegacy.logout
export const initAuth = useKeycloak ? authKeycloak.initAuth : authLegacy.initAuth
export const getReturnPath = useKeycloak ? authKeycloak.getReturnPath : authLegacy.getReturnPath
export const getScopes = useKeycloak ? authKeycloak.getScopes : authLegacy.getScopes
export const getName = useKeycloak ? authKeycloak.getName : authLegacy.getName
export const getAuthHeaders = useKeycloak ? authKeycloak.getAuthHeaders : authLegacy.getAuthHeaders
export const isAuthenticated = useKeycloak
  ? authKeycloak.isAuthenticated
  : authLegacy.isAuthenticated
