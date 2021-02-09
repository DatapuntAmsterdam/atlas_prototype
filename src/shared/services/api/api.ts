import { logout, getAuthHeaders } from '../auth/auth'
import getState from '../redux/get-state'
import SHARED_CONFIG from '../shared-config/shared-config'
import { AuthError, ForbiddenError, NotFoundError } from './customError'

interface FetchOptions extends RequestInit {
  searchParams?: UrlParams
}
// TODO: Refactor this type to only allow 'URLSearchParams'.
export type UrlParams = URLSearchParams | { [key: string]: string }

const getAccessToken = () => getState()?.user?.accessToken

export const fetchWithoutToken = <T = any>(uri: string): Promise<T> =>
  fetch(uri).then((response) => response.json())

const handleErrors = (response: Response, reloadOnUnauthorized = false) => {
  if (response.status >= 400 && response.status <= 401 && reloadOnUnauthorized) {
    logout()
  }

  if (response.status === 401) {
    throw new AuthError(response.status, '')
  }

  if (response.status === 403) {
    throw new ForbiddenError(response.status, '')
  }

  if (response.status === 404) {
    throw new NotFoundError(response.status, response.statusText)
  }

  if (!response.ok) {
    throw Error(response.statusText)
  }

  return response
}

// TODO: Change parameters of fetchWithToken to match regular Fetch API.
export const fetchWithToken = <T = any>(
  url: string,
  params?: UrlParams,
  cancel?: AbortSignal,
  reloadOnUnauthorized = false,
  headers?: Headers,
  token = getAccessToken(),
): Promise<T> => {
  const requestHeaders = headers ?? new Headers()

  if (token?.length > 0) {
    requestHeaders.set('Authorization', SHARED_CONFIG.AUTH_HEADER_PREFIX + token)
  }

  const options: RequestInit = {
    headers: requestHeaders,
  }

  if (cancel) {
    options.signal = cancel
  }

  const searchParams = (params instanceof URLSearchParams
    ? params
    : new URLSearchParams(params)
  ).toString()

  const fullUrl = `${url}${searchParams ? `?${searchParams}` : ''}`

  return fetch(fullUrl, options)
    .then((response) => handleErrors(response, reloadOnUnauthorized))
    .then((response) => response.json()) as Promise<T>
}

export const createUrlWithToken = (url: string, token: string) => {
  const parsedUrl = new URL(url)

  if (token.length > 0) {
    parsedUrl.searchParams.set('access_token', token)
  }

  return parsedUrl.toString()
}

export const fetchProxy = <T = any>(url: string, init: FetchOptions = {}): Promise<T> => {
  const { headers, searchParams = {}, ...otherOptions } = init
  const requestHeaders = new Headers(headers)
  const authHeaders = Object.entries(getAuthHeaders())

  authHeaders.forEach(([name, value]) => {
    if (value) requestHeaders.append(name, value)
  })

  const options: RequestInit = {
    ...otherOptions,
    headers: requestHeaders,
  }

  const fullUrl = new URL(url)
  const params = new URLSearchParams(searchParams)
  const paramsInUrl = fullUrl.searchParams

  params.forEach((value, key) => {
    paramsInUrl.set(key, value)
  })

  fullUrl.search = paramsInUrl.toString()

  return fetch(fullUrl.toString(), options)
    .then((response) => handleErrors(response))
    .then((response) => response.json()) as Promise<T>
}
