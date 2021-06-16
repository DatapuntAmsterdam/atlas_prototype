import { fetchWithToken } from '../../../../../../shared/services/api/api'
import normalize, { fetchByAddressId, fetchByPandId } from './vestiging'
import type { PotentialApiResult } from '../../types/details'

jest.mock('../../../../../../shared/services/api/api')
jest.mock('../map-fetch/map-fetch')

describe('The vestiging resource', () => {
  afterEach(() => {
    // @ts-ignore
    fetchWithToken.mockReset()
  })

  it('normalizes a vestiging', async () => {
    const mockVestiging = {
      activiteiten: [
        {
          sbi_code: 123,
          sbi_omschrijving: 'foo',
        },
      ],
      maatschappelijke_activiteit: 'https://api.call',
      bezoekadres: {
        geometrie: 'geo',
      },
      _bijzondere_rechts_toestand: {
        faillissement: true,
        status: 'Voorlopig',
      },
      hoofdvestiging: true,
    } as unknown as PotentialApiResult

    const result = await normalize(mockVestiging)

    expect(fetchWithToken).toHaveBeenCalledWith(mockVestiging.maatschappelijke_activiteit)

    expect(result).toMatchObject({
      activities: `123: foo`,
      type: 'Hoofdvestiging',
      bijzondereRechtstoestand: {
        label: 'Faillissement',
      },
      ...mockVestiging,
    })
  })

  it('can fetch a vestiging by pand id', () => {
    // @ts-ignore
    fetchWithToken.mockReturnValueOnce(
      Promise.resolve({
        results: [
          {
            _display: 'Vestiging display name 1',
            id: 'abc123',
          },
          {
            _display: 'Vestiging display name 2',
            id: 'xyz456',
          },
        ],
      }),
    )

    const promise = fetchByPandId('1').then((response) => {
      expect(response).toEqual([
        {
          _display: 'Vestiging display name 1',
          id: 'abc123',
        },
        {
          _display: 'Vestiging display name 2',
          id: 'xyz456',
        },
      ])
    })

    // @ts-ignore
    expect(fetchWithToken.mock.calls[0][0]).toContain('pand=1')
    return promise
  })

  it('can fetch a vestiging by address id', () => {
    // @ts-ignore
    fetchWithToken.mockReturnValueOnce(
      Promise.resolve({
        results: [
          {
            _display: 'Vestiging display name 1',
            id: 'abc123',
          },
          {
            _display: 'Vestiging display name 2',
            id: 'xyz456',
          },
        ],
      }),
    )

    const promise = fetchByAddressId('0').then((response) => {
      expect(response).toEqual([
        {
          _display: 'Vestiging display name 1',
          id: 'abc123',
        },
        {
          _display: 'Vestiging display name 2',
          id: 'xyz456',
        },
      ])
    })

    // @ts-ignore
    expect(fetchWithToken.mock.calls[0][0]).toContain('nummeraanduiding=0')
    return promise
  })
})
