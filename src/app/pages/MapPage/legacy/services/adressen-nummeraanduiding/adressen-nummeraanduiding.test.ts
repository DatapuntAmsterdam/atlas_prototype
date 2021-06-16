import { fetchWithToken } from '../../../../../../shared/services/api/api'
import mapFetch from '../map-fetch/map-fetch'
import normalize, {
  fetchByLigplaatsId,
  fetchByStandplaatsId,
  fetchHoofdadresByLigplaatsId,
  fetchHoofdadresByStandplaatsId,
} from './adressen-nummeraanduiding'
import type { Single as Nummeraanduiding } from '../../../../../../api/bag/v1.1/nummeraanduiding'

jest.mock('../../../../../../shared/services/api/api')
jest.mock('../normalize/normalize')
jest.mock('../map-fetch/map-fetch')

describe('The adressen nummeraanduiding resource', () => {
  afterEach(() => {
    // @ts-ignore
    fetchWithToken.mockReset()
    // @ts-ignore
    mapFetch.mockReset()
  })

  it('normalizes a nummeraanduiding', async () => {
    const mockNummeraanduiding = {
      _display: 'Address display name 1',
      type_adres: 'Hoofdadres',
      landelijk_id: 'abc123',
      verblijfsobject: 'https://acc.api.data.amsterdam.nl/bag/adressenVerblijfsobject/345678',
      _geometrie: {
        type: 'Point',
        coordinates: [123, 321],
      },
    } as Nummeraanduiding

    const mockVerblijsfobject = {
      gebruiksdoelen: 'foo',
      gebruik: 'gebruik',
      status: 'status',
      size: 100,
      statusLevel: 'foo',
    }

    const result = await normalize(mockNummeraanduiding)
    // @ts-ignore
    fetchWithToken.mockImplementationOnce(() => mockVerblijsfobject)
    expect(fetchWithToken).toHaveBeenCalledWith(mockNummeraanduiding.verblijfsobject)

    expect(result).toEqual({
      geometry: {
        type: 'Point',
        coordinates: [123, 321],
      },
      isNevenadres: false,
      verblijfsobjectData: undefined,
      ...mockNummeraanduiding,
    })
  })

  it('fetches a nummeraanduiding without "verblijsobject"', async () => {
    const mockNummeraanduiding = {
      _display: 'Address display name 1',
      type_adres: 'Nevenadres',
      landelijk_id: 'abc123',

      _geometrie: {
        type: 'Point',
        coordinates: [123, 321],
      },
    } as Nummeraanduiding

    const result = await normalize(mockNummeraanduiding)

    expect(mapFetch).not.toHaveBeenCalled()

    expect(result).toEqual({
      geometry: {
        type: 'Point',
        coordinates: [123, 321],
      },
      isNevenadres: true,
      verblijfsobjectData: undefined,
      ...mockNummeraanduiding,
    })
  })

  it('can fetch nummeraanduidingen by ligplaats id, adds `id` attribute', () => {
    // @ts-ignore
    fetchWithToken.mockReturnValueOnce(
      Promise.resolve({
        results: [
          {
            _display: 'Address display name 1',
            landelijk_id: 'abc123',
          },
          {
            _display: 'Address display name 2',
            landelijk_id: 'xyz456',
          },
        ],
      }),
    )

    const promise = fetchByLigplaatsId('abc123').then((response) => {
      expect(response).toEqual([
        {
          _display: 'Address display name 1',
          landelijk_id: 'abc123',
          id: 'abc123',
        },
        {
          _display: 'Address display name 2',
          landelijk_id: 'xyz456',
          id: 'xyz456',
        },
      ])
    })

    // @ts-ignore
    expect(fetchWithToken.mock.calls[0][0]).toContain('ligplaats=abc123')
    return promise
  })

  it('can fetch the hoofdadres by ligplaats id', () => {
    // @ts-ignore
    fetchWithToken.mockReturnValueOnce(
      Promise.resolve({
        results: [
          {
            _display: 'Address display name 1',
            landelijk_id: '123',
          },
          {
            _display: 'Address display name 2',
            landelijk_id: '456',
            hoofdadres: {},
          },
          {
            _display: 'Address display name 3',
            landelijk_id: '789',
          },
        ],
      }),
    )

    const promise = fetchHoofdadresByLigplaatsId('abc123').then((response) => {
      expect(response).toEqual({
        _display: 'Address display name 2',
        landelijk_id: '456',
        id: '456',
        hoofdadres: {},
      })
    })

    // @ts-ignore
    expect(fetchWithToken.mock.calls[0][0]).toContain('ligplaats=abc123')
    return promise
  })

  it('fetching the hoofdadres by ligplaats id when not available', () => {
    // @ts-ignore
    fetchWithToken.mockReturnValueOnce(
      Promise.resolve({
        results: [
          {
            _display: 'Address display name 1',
            landelijk_id: '123',
          },
          {
            _display: 'Address display name 2',
            landelijk_id: '456',
          },
        ],
      }),
    )

    const promise = fetchHoofdadresByLigplaatsId('abc123').then((response) => {
      expect(response).not.toBeDefined()
    })

    // @ts-ignore
    expect(fetchWithToken.mock.calls[0][0]).toContain('ligplaats=abc123')
    return promise
  })

  it('can fetch nummeraanduidingen by standplaats id, adds `id` attribute', () => {
    // @ts-ignore
    fetchWithToken.mockReturnValueOnce(
      Promise.resolve({
        results: [
          {
            _display: 'Address display name 1',
            landelijk_id: 'abc123',
          },
          {
            _display: 'Address display name 2',
            landelijk_id: 'xyz456',
          },
        ],
      }),
    )

    const promise = fetchByStandplaatsId('abc123').then((response) => {
      expect(response).toEqual([
        {
          _display: 'Address display name 1',
          landelijk_id: 'abc123',
          id: 'abc123',
        },
        {
          _display: 'Address display name 2',
          landelijk_id: 'xyz456',
          id: 'xyz456',
        },
      ])
    })

    // @ts-ignore
    expect(fetchWithToken.mock.calls[0][0]).toContain('standplaats=abc123')
    return promise
  })

  it('can fetch the hoofdadres by standplaats id', () => {
    // @ts-ignore
    fetchWithToken.mockReturnValueOnce(
      Promise.resolve({
        results: [
          {
            _display: 'Address display name 1',
            landelijk_id: '123',
          },
          {
            _display: 'Address display name 2',
            landelijk_id: '456',
            hoofdadres: {},
          },
          {
            _display: 'Address display name 3',
            landelijk_id: '789',
          },
        ],
      }),
    )

    const promise = fetchHoofdadresByStandplaatsId('abc123').then((response) => {
      expect(response).toEqual({
        _display: 'Address display name 2',
        landelijk_id: '456',
        id: '456',
        hoofdadres: {},
      })
    })

    // @ts-ignore
    expect(fetchWithToken.mock.calls[0][0]).toContain('standplaats=abc123')
    return promise
  })

  it('fetching the hoofdadres by standplaats id when not available', () => {
    // @ts-ignore
    fetchWithToken.mockReturnValueOnce(
      Promise.resolve({
        results: [
          {
            _display: 'Address display name 1',
            landelijk_id: '123',
          },
          {
            _display: 'Address display name 2',
            landelijk_id: '456',
          },
        ],
      }),
    )

    const promise = fetchHoofdadresByStandplaatsId('abc123').then((response) => {
      expect(response).not.toBeDefined()
    })

    // @ts-ignore
    expect(fetchWithToken.mock.calls[0][0]).toContain('standplaats=abc123')
    return promise
  })
})
