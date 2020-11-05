import joinUrl from '../../../app/utils/joinUrl'
import environment from '../../../environment'
import { server, rest } from '../../../../test/server'

import { getPanoramaThumbnail } from './getPanoramaThumbnail'

jest.mock('../../../shared/services/api/api', () =>
  jest.requireActual('../../../shared/services/api/api'),
)

describe('getPanoramaThumbnail', () => {
  const apiUrl = joinUrl([environment.API_ROOT, 'panorama/thumbnail'])
  const validResponse = {
    pano_id: 'pano_id',
    heading: 'heading',
    url: 'url',
  }

  it('makes an api call and returns the correct response', async () => {
    let searchParams: URLSearchParams = new URLSearchParams()
    server.use(
      rest.get(apiUrl, async (req, res, ctx) => {
        searchParams = req.url.searchParams
        return res(ctx.json(validResponse))
      }),
    )

    const lat = 123
    const lng = 312
    const result = await getPanoramaThumbnail({ lat, lng })

    expect(result).toEqual({
      id: validResponse.pano_id,
      heading: validResponse.heading,
      url: validResponse.url,
    })

    expect(searchParams.toString()).toEqual(`lat=${lat}&lon=${lng}`)
  })

  it('handles a faulty empty response by transforming it to null', async () => {
    // This is a bug in the API we have to work around.
    server.use(
      rest.get(apiUrl, async (req, res, ctx) => {
        return res(ctx.json([]))
      }),
    )

    const result = await getPanoramaThumbnail({ lat: 123, lng: 321 })
    expect(result).toBeNull()
  })

  it('rejects when any errors occur', async () => {
    server.use(
      rest.get(apiUrl, async (req, res, ctx) => {
        return res(ctx.status(500))
      }),
    )

    await expect(getPanoramaThumbnail({ lat: 123, lng: 321 })).rejects.toThrow()

    server.use(
      rest.get(apiUrl, async (req, res, ctx) => {
        return res(ctx.status(401))
      }),
    )

    await expect(getPanoramaThumbnail({ lat: 123, lng: 321 })).rejects.toThrow()
  })

  it('adds all possible parameters to the request', async () => {
    let searchParams: URLSearchParams = new URLSearchParams()
    server.use(
      rest.get(apiUrl, async (req, res, ctx) => {
        searchParams = req.url.searchParams
        return res(ctx.json(validResponse))
      }),
    )

    await getPanoramaThumbnail(
      { lat: 123, lng: 321 },
      {
        width: 100,
        fov: 90,
        horizon: 0.4,
        aspect: 1.4,
        radius: 180,
      },
    )

    expect(searchParams.toString()).toEqual(
      'lat=123&lon=321&width=100&fov=90&horizon=0.4&aspect=1.4&radius=180',
    )
  })
})
