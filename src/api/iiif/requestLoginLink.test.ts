import { rest, server } from '../../../test/server'
import joinUrl from '../../app/utils/joinUrl'
import environment from '../../environment'
import requestLoginLink from './requestLoginLink'

describe('requestLoginLink', () => {
  const email = 'foo@bar.com'
  const originUrl = 'https://test-domain.org/foo/bar'

  it('sends a request for the login link', async () => {
    server.use(
      rest.post(
        joinUrl([environment.IIIF_ROOT, 'iiif/login-link-to-email'], true),
        (req, res, ctx) => {
          expect(req.body).toEqual({ email, origin_url: originUrl })

          return res(ctx.status(200))
        },
      ),
    )

    await requestLoginLink({ email, originUrl })
  })

  it('throws an error if the response is not ok', async () => {
    server.use(
      rest.post(
        joinUrl([environment.IIIF_ROOT, 'iiif/login-link-to-email'], true),
        (req, res, ctx) => res(ctx.status(500)),
      ),
    )

    await expect(requestLoginLink({ email, originUrl })).rejects.toThrow('Response is not ok.')
  })
})
