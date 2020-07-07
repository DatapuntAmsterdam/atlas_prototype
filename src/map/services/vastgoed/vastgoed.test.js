import { fetchWithToken } from '../../../shared/services/api/api'
import mapFetch from '../map-fetch/map-fetch'
import { vastgoed } from '../normalize/normalize'
import fetchByGeoLocation from './vastgoed'
import environment from '../../../environment'

jest.mock('../../../shared/services/api/api')
jest.mock('../../../shared/services/shared-config/shared-config')
jest.mock('../map-fetch/map-fetch')
jest.mock('../normalize/normalize')

jest.useFakeTimers()

describe('The vastgoed resource', () => {
  let vastgoedMock = {
    _display: 'display',
    object_naam: 'object_naam',
    bouwjaar: 1000,
    status: 'status',
    monumentstatus: 'monumentstatus',
    vhe_adres: 'Street 123',
    bag_verblijfsobject_gebruiksdoelen: 'gebruiksdoel',
    huurtype: 'huurtype',
    oppervlakte: 123,
    bag_pand_geometrie: { type: 'Point' },
    features: [{ properties: { id: 1 } }],
  }

  afterEach(() => {
    fetchWithToken.mockReset()
  })

  it('fetches the vastgoed geosearch', async () => {
    vastgoedMock = {
      ...vastgoedMock,
      features: [{ properties: { id: 1 } }, { properties: { id: 2 } }],
    }

    const mockLocation = { latitude: 123, longitude: 456 }
    const mockFeature = { feature: 'This is the feature info' }

    fetchWithToken.mockImplementation(() => vastgoedMock)
    mapFetch.mockImplementation(() => mockFeature)
    vastgoed.mockImplementation(() => {})

    const result = await fetchByGeoLocation(mockLocation)

    // Will retrieve the information for the second feature
    expect(mapFetch).toHaveBeenCalledWith(
      `${environment.API_ROOT}vsd/vastgoed/${vastgoedMock.features[1].properties.id}/`,
      false,
      vastgoed,
    )

    // Returns the result from mapFetch for both features
    expect(result).toStrictEqual([mockFeature, mockFeature])
  })
})
