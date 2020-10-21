import { getEndpointTypeForResult, pageTypeToEndpoint } from './map-detail'
import { endpointTypes } from '../map-services.config'

jest.mock('../map-fetch/map-fetch')

describe('map-detail', () => {
  it('should return the correct endpoint for the page type', () => {
    const result = pageTypeToEndpoint('type', 'subtype', 123)

    expect(result).toContain('/type/subtype/123')
  })

  // code exception
  it("should return the correct endpoint for the page type when it's predefined", () => {
    const result = pageTypeToEndpoint('explosieven', 'gevrijwaardgebied', 123)

    expect(result).toContain('/milieuthemas/explosieven/gevrijwaardgebied/123')
  })

  it('should return the correct endpoint type for the result', () => {
    const result = getEndpointTypeForResult('endpointType', {})

    expect(result).toBe('endpointType')
  })

  // code exception
  it('should return the correct endpoint type for the result when certain type', () => {
    let result

    result = getEndpointTypeForResult(endpointTypes.adressenNummeraanduiding, {})

    expect(result).toBe(endpointTypes.adressenNummeraanduiding)

    result = getEndpointTypeForResult(endpointTypes.adressenNummeraanduiding, {
      ligplaats: true,
    })

    expect(result).toBe(endpointTypes.adressenLigplaats)

    result = getEndpointTypeForResult(endpointTypes.adressenNummeraanduiding, {
      standplaats: true,
    })

    expect(result).toBe(endpointTypes.adressenStandplaats)
  })
})
