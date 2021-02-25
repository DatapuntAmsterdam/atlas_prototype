import { server, rest, MockedRequest } from '../../../../test/server'
import { path, singleFixture } from '.'
import { getPanoramaThumbnail } from './getPanoramaThumbnail'

let request: MockedRequest | undefined

describe('getPanoramaThumbnail', () => {
  beforeEach(() => {
    request = undefined

    server.use(
      rest.get(new RegExp(`${path}*`), async (req, res, ctx) => {
        const response = await res(ctx.status(200), ctx.json(singleFixture))
        request = req
        return response
      }),
    )
  })

  it('makes an api call and calls it with the correct params', async () => {
    await getPanoramaThumbnail({ lat: 123, lng: 321 })

    expect(request?.url.toString()).toEqual(expect.stringContaining('?lat=123&lon=321'))
  })

  it('handles a faulty empty response by transforming it to null', async () => {
    server.use(
      rest.get('*', async (req, res, ctx) => {
        const response = await res(ctx.status(200), ctx.json([]))
        request = req
        return response
      }),
    )

    await expect(getPanoramaThumbnail({ lat: 123, lng: 321 })).resolves.toEqual(null)
  })

  it('rejects when any errors occur', async () => {
    server.use(
      rest.get('*', async (req, res, ctx) => {
        const response = await res(ctx.status(500))
        request = req
        return response
      }),
    )

    await expect(
      getPanoramaThumbnail({
        lat: 123,
        lng: 321,
      }),
    ).rejects.toThrow()
  })

  it('adds all possible parameters to the request', async () => {
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

    expect(request?.url.toString()).toEqual(
      expect.stringContaining(
        '?lat=123&lon=321&width=100&fov=90&horizon=0.4&aspect=1.4&radius=180',
      ),
    )
  })
})
