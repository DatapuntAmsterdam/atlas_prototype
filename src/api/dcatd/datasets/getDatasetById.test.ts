import { server, rest, MockedRequest } from '../../../../test/server'
import joinUrl from '../../../app/utils/joinUrl'
import environment from '../../../environment'
import { path, singleFixture } from '.'
import { getDatasetById } from './getDatasetById'

let request: MockedRequest | undefined

describe('getDatasetById', () => {
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

  it('makes an api call and returns the correct response', async () => {
    await getDatasetById('baz')

    expect(request?.url.toString()).toEqual(
      expect.stringContaining(joinUrl([environment.API_ROOT, 'dcatd/datasets/baz'])),
    )
  })
})
