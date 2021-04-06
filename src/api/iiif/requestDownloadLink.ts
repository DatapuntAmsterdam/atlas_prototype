import joinUrl from '../../app/utils/joinUrl'
import environment from '../../environment'
import { getAccessToken } from '../../shared/services/auth/auth'

/**
 * Requests a link to download the list of specified file URLs as a ZIP file.
 * This ZIP file will be send to the user based on the e-mail address in the token.
 *
 * @param urls The URLs to download into the ZIP file
 * @param token The token from a login link, if not specified the access token is used.
 */
export default async function requestDownloadLink(urls: string[], token: string | null = null) {
  const accessToken = getAccessToken()

  if (!token && !accessToken) {
    throw new Error('Unable to request download, no token present.')
  }

  const url = new URL(joinUrl([environment.IIIF_ROOT, 'iiif/zip'], true))
  const headers = new Headers({
    'Content-Type': 'application/json',
  })

  if (token) {
    url.searchParams.set('auth', token)
  } else {
    headers.set('Authorization', `Bearer ${getAccessToken()}`)
  }

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers,
    body: JSON.stringify({ urls }),
  })

  if (!response.ok) {
    throw new Error('Response is not ok.')
  }
}
