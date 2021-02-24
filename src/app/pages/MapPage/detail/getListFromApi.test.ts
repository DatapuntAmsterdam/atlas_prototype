import { rest } from 'msw'
import getListFromApi from './getListFromApi'
import { server } from '../../../../../test/server'
import joinUrl from '../../../utils/joinUrl'
import environment from '../../../../environment'
import {
  path as woonplaatsPath,
  listFixture as woonplaatsenList,
} from '../../../../api/bag/v1/woonplaatsen'
import {
  path as stadsdeelPath,
  listFixture as stadsdeelList,
} from '../../../../api/gebieden/stadsdeel'

const woonplaatsenUrl = joinUrl([environment.API_ROOT, woonplaatsPath])
const gebiedenUrl = joinUrl([environment.API_ROOT, stadsdeelPath])

describe('getListFromApi', () => {
  beforeEach(() => {
    server.use(
      rest.get(gebiedenUrl, async (req, res, ctx) => {
        return res(ctx.json(stadsdeelList))
      }),
      // New BAG API
      rest.get(woonplaatsenUrl, async (req, res, ctx) => {
        return res(ctx.json(woonplaatsenList))
      }),
    )
  })
  it('should return an expected object', async () => {
    const result = await getListFromApi(gebiedenUrl)()
    expect(result).toEqual({
      count: 8,
      data: stadsdeelList.results,
      next: null,
      previous: null,
    })
  })
  it('should deal with new API formats', async () => {
    const result = await getListFromApi(woonplaatsenUrl)()
    expect(result).toEqual({
      count: 6,
      data: woonplaatsenList,
      next: null,
      previous: null,
    })
  })
})
