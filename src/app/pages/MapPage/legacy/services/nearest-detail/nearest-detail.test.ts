import { mocked } from 'ts-jest/utils'
import { fetchWithToken } from '../../../../../../shared/services/api/api'
import fetchNearestDetail from './nearest-detail'

jest.mock('../../../../../../shared/services/api/api')

const mockedFetchWithToken = mocked(fetchWithToken)

describe('fetchNearestDetail', () => {
  it('should fetch the nearest detail', async () => {
    mockedFetchWithToken.mockImplementation(() =>
      Promise.resolve({
        features: [
          {
            properties: {
              display: 'ASD03 E 09114 G 0000',
              distance: 0,
              id: 'NL.KAD.OnroerendeZaak.11440911470000',
              type: 'kadaster/kadastraal_object',
              uri: 'https://acc.api.data.amsterdam.nl/brk/object/NL.KAD.OnroerendeZaak.11440911470000/',
            },
          },
          {
            properties: {
              display: 'ASD03 E 08860 G 0000',
              distance: 0,
              id: 'NL.KAD.OnroerendeZaak.11440886070000',
              type: 'kadaster/kadastraal_object',
              uri: 'https://acc.api.data.amsterdam.nl/brk/object/NL.KAD.OnroerendeZaak.11440886070000/',
            },
          },
        ],
        type: 'FeatureCollection',
      }),
    )

    const result = await fetchNearestDetail(
      { latitude: 1, longitude: 2 },
      [{ detailUrl: 'some/url' } as any],
      1,
    )

    expect(result).toEqual({
      detailIsShape: undefined,
      distance: 0,
      display: 'ASD03 E 09114 G 0000',
      uri: 'https://acc.api.data.amsterdam.nl/brk/object/NL.KAD.OnroerendeZaak.11440911470000/',
      id: 'NL.KAD.OnroerendeZaak.11440911470000',
      subType: 'object',
      type: 'brk',
    })
  })
})
