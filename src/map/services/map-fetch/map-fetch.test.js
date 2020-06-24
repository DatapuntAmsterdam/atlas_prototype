import { fetchWithToken } from '../../../shared/services/api/api'
import fetchByUri from './map-fetch'

jest.mock('../../../shared/services/api/api')
jest.mock('../../../shared/services/geo-json/geo-json')
jest.mock('../../../shared/services/coordinate-reference-system/crs-converter')

describe('map-fetch', () => {
  it('should return the API results including geometry and location', async () => {
    const uri = 'https://api.call'

    const mockResult = {
      geometrie: 'geometrie',
      location: [0, 1],
      _display: 'label',
    }

    fetchWithToken.mockImplementation(() => mockResult)
    const detail = jest.fn()

    const result = await fetchByUri(uri, detail)

    expect(fetchWithToken).toHaveBeenCalledWith(uri)
    expect(detail).toHaveBeenCalledWith(mockResult)

    expect(result).toMatchObject({ geometrie: 'geometrie', label: 'label', location: [0, 1] })
  })

  it('should normalize the API results', async () => {
    const uri = 'https://api.call'

    const mockNormalization = jest.fn(() => ({
      field: 'foo',
      geometry: 'normalized',
    }))

    const mockResult = {
      location: [0, 1],
      _display: 'label',
    }

    fetchWithToken.mockImplementation(() => mockResult)
    // The detail function returns a further normalized result
    const detail = jest.fn((result) => ({ field: result.field }))

    const result = await fetchByUri(uri, detail, mockNormalization)

    expect(mockNormalization).toHaveBeenCalledWith(mockResult)

    expect(result).toMatchObject({ field: 'foo', geometrie: 'normalized' })
  })
})
