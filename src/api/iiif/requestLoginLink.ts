import joinUrl from '../../app/utils/joinUrl'
import environment from '../../environment'

export interface RequestLoginLinkParams {
  /**
   * The e-mail address to send the login link.
   */
  email: string
  /**
   * The page that should be linked to in the e-mail, the token will be added to this.
   */
  originUrl: string
}

/**
 * Sends an email to the specified address containing a login link that can be used to authenticate a user temporarily.
 *
 * The link in the e-mail will return the user to the page specified in `originUrl` and add a JWT token as a query parameter.
 * This token can be used to make authenticated requests to the IIIF server.
 *
 * @param params
 */
export default async function requestLoginLink({ email, originUrl }: RequestLoginLinkParams) {
  const response = await fetch(joinUrl([environment.IIIF_ROOT, 'iiif/login-link-to-email'], true), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      origin_url: originUrl,
    }),
  })

  if (!response.ok) {
    throw new Error('Response is not ok.')
  }
}
