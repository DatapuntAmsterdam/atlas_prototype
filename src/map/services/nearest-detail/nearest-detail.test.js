import { fetchWithToken } from '../../../shared/services/api/api'
import fetchNearestDetail, { sortResults } from './nearest-detail'

jest.mock('../../../shared/services/api/api')

describe('fetchNearestDetail', () => {
  it('should sortResults the results on distance and detailIsShape', () => {
    expect(
      sortResults([
        {
          detailIsShape: true,
          distance: 10,
        },
        {
          detailIsShape: undefined,
          distance: 9,
        },
        {
          detailIsShape: undefined,
          distance: 8,
        },
        {
          detailIsShape: undefined,
          distance: 10,
        },
        {
          detailIsShape: true,
          distance: 9,
        },
      ]),
    ).toEqual([
      {
        detailIsShape: undefined,
        distance: 8,
      },
      {
        detailIsShape: undefined,
        distance: 9,
      },
      {
        detailIsShape: undefined,
        distance: 10,
      },
      {
        detailIsShape: true,
        distance: 9,
      },
      {
        detailIsShape: true,
        distance: 10,
      },
    ])
  })

  it('should sadsa', async () => {
    fetchWithToken.mockImplementation(() =>
      Promise.resolve({
        features: [
          {
            properties: {
              display: 'ASD03 E 09114 G 0000',
              distance: 0,
              id: 'NL.KAD.OnroerendeZaak.11440911470000',
              type: 'kadaster/kadastraal_object',
              uri:
                'https://acc.api.data.amsterdam.nl/brk/object/NL.KAD.OnroerendeZaak.11440911470000/',
            },
          },
          {
            properties: {
              display: 'ASD03 E 08860 G 0000',
              distance: 0,
              id: 'NL.KAD.OnroerendeZaak.11440886070000',
              type: 'kadaster/kadastraal_object',
              uri:
                'https://acc.api.data.amsterdam.nl/brk/object/NL.KAD.OnroerendeZaak.11440886070000/',
            },
          },
        ],
        type: 'FeatureCollection',
      }),
    )

    const result = await fetchNearestDetail('location', [{}], 1)
    expect(result).toEqual({
      detailIsShape: undefined,
      distance: 0,
      display: 'ASD03 E 09114 G 0000',
      uri: 'https://acc.api.data.amsterdam.nl/brk/object/NL.KAD.OnroerendeZaak.11440911470000/',
      id: 'NL.KAD.OnroerendeZaak.11440911470000',
      type: 'kadaster/kadastraal_object',
    })
  })
})
