import { mocked } from 'ts-jest/utils'
import { rest, server } from '../../../test/server'
import joinUrl from '../../app/utils/joinUrl'
import environment from '../../environment'
import requestDownloadLink from './requestDownloadLink'
import { getAccessToken } from '../../shared/services/auth/auth'

const MOCK_ACCESS_TOKEN = 'FAKEACCESSTOKEN'
const MOCK_URLS = ['https://fake.com/some/path/foo.png', 'https://fake.com/some/path/bar.png']

jest.mock('../../shared/services/auth/auth')

const getAccessTokenMock = mocked(getAccessToken)

describe('requestDownloadLink', () => {
  beforeEach(() => {
    getAccessTokenMock.mockReturnValue(MOCK_ACCESS_TOKEN)
  })

  afterEach(() => {
    getAccessTokenMock.mockClear()
  })

  it('throws an exception if no tokens are set', async () => {
    getAccessTokenMock.mockReturnValue('')

    await expect(requestDownloadLink(MOCK_URLS)).rejects.toThrow(
      'Unable to request download, no token present.',
    )
  })

  it('requests a download link with the access token', async () => {
    server.use(
      rest.post(joinUrl([environment.IIIF_ROOT, 'iiif/zip'], true), (req, res, ctx) => {
        expect(req.body).toEqual({ urls: MOCK_URLS })
        expect(req.headers.get('Authorization')).toEqual(`Bearer ${MOCK_ACCESS_TOKEN}`)

        return res(ctx.status(200))
      }),
    )

    await requestDownloadLink(MOCK_URLS)
  })

  it('requests a download link with the login link token', async () => {
    const token = 'FAKETOKEN'

    server.use(
      rest.post(joinUrl([environment.IIIF_ROOT, 'iiif/zip'], true), (req, res, ctx) => {
        expect(req.body).toEqual({ urls: MOCK_URLS })
        expect(req.url.searchParams.get('auth')).toEqual(token)

        return res(ctx.status(200))
      }),
    )

    await requestDownloadLink(MOCK_URLS, token)
  })

  it('throws an error if the response is not ok', async () => {
    server.use(
      rest.post(joinUrl([environment.IIIF_ROOT, 'iiif/zip'], true), (req, res, ctx) =>
        res(ctx.status(500)),
      ),
    )

    await expect(requestDownloadLink(MOCK_URLS)).rejects.toThrow('Response is not ok.')
  })
})
