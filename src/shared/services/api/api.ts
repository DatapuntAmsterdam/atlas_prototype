import { logout } from '../auth/auth'
import getState from '../redux/get-state'
import SHARED_CONFIG from '../shared-config/shared-config'

// TODO: Refactor this type to only allow 'URLSearchParams'.
export type UrlParams = URLSearchParams | { [key: string]: string }

const getAccessToken = () => getState().user.accessToken

export const fetchWithoutToken = <T = any>(uri: string): Promise<T> =>
  fetch(uri).then((response) => response.json())

const handleErrors = (response: Response, reloadOnUnauthorized: boolean) => {
  if (response.status >= 400 && response.status <= 401 && reloadOnUnauthorized) {
    logout()
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

  if (token.length > 0) {
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
    .then((response) => response.json())
}

export const createUrlWithToken = (url: string, token: string) => {
  const parsedUrl = new URL(url)

  if (token.length > 0) {
    parsedUrl.searchParams.set('access_token', token)
  }

  return parsedUrl.toString()
}
