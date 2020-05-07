import { logout } from '../auth/auth'
import { encodeQueryParams } from '../query-string-parser/query-string-parser'
import getState from '../redux/get-state'
import SHARED_CONFIG from '../shared-config/shared-config'

export const getAccessToken = () => getState().user.accessToken

export const generateParams = (data) =>
  Object.entries(data)
    .filter(([, value]) => value !== null && value !== undefined)
    .map((pair) => pair.map(encodeURIComponent).join('='))
    .join('&')

// Todo: DP-6393
const handleErrors = (response, reloadOnUnauthorized) => {
  if (response.status >= 400 && response.status <= 401 && reloadOnUnauthorized) {
    logout()
  }
  if (!response.ok) {
    throw Error(response.statusText)
  }
  return response
}

export const getByUri = (uri) => fetch(uri).then((response) => response.json())

export const getWithToken = (url, params, cancel, token, reloadOnUnauthorized = false) => {
  const headers = {}

  if (token) {
    headers.Authorization = SHARED_CONFIG.AUTH_HEADER_PREFIX + token
  }

  const options = {
    method: 'GET',
    headers,
  }

  if (cancel) {
    options.signal = cancel
  }

  const fullUrl = `${url}${params ? `?${generateParams(params)}` : ''}`
  return fetch(fullUrl, options)
    .then((response) => handleErrors(response, reloadOnUnauthorized))
    .then((response) => response.json())
}

export const getByUrl = async (url, params, cancel, reloadOnUnauthorized) => {
  const token = getAccessToken()
  return Promise.resolve(getWithToken(url, params, cancel, token, reloadOnUnauthorized))
}

export const createUrlWithToken = (url, token) => {
  const params = {}
  if (token) {
    params.access_token = token
  }
  const queryStart = url.indexOf('?') !== -1 ? '&' : '?'
  const paramString = encodeQueryParams(params)
  const queryString = paramString ? queryStart + paramString : ''
  return url + queryString
}
