import { fetchWithToken } from '../../../shared/services/api/api'
import normalize, { fetchByAddressId, fetchByPandId } from './vestiging'

jest.mock('../../../shared/services/api/api')
jest.mock('../map-fetch/map-fetch')

describe('The vestiging resource', () => {
  afterEach(() => {
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
    }

    const result = await normalize(mockVestiging)

    expect(fetchWithToken).toHaveBeenCalledWith(mockVestiging.maatschappelijke_activiteit)

    expect(result).toMatchObject({
      activities: `${mockVestiging.activiteiten[0].sbi_code}: ${mockVestiging.activiteiten[0].sbi_omschrijving}`,
      type: 'Hoofdvestiging',
      bijzondereRechtstoestand: {
        label: 'Faillissement',
      },
      ...mockVestiging,
    })
  })

  it('can fetch a vestiging by pand id', () => {
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

    const promise = fetchByPandId(1).then((response) => {
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

    expect(fetchWithToken.mock.calls[0][0]).toContain('pand=1')
    return promise
  })

  it('can fetch a vestiging by address id', () => {
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

    const promise = fetchByAddressId(0).then((response) => {
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

    expect(fetchWithToken.mock.calls[0][0]).toContain('nummeraanduiding=0')
    return promise
  })
})
