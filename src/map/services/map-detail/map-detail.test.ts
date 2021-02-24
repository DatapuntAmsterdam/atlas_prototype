import { getEndpointTypeForResult, pageTypeToEndpoint } from './map-detail'
import { endpointTypes } from '../map-services.config'
import environment from '../../../environment'

describe('map-detail', () => {
  it('should return an endpoint from the given arguments if endpoint cannot be found from the map services config', () => {
    expect(pageTypeToEndpoint('type', 'subtype', '123')).toEqual(
      `${environment.API_ROOT}type/subtype/123/`,
    )
  })

  it("should return the correct endpoint for the page type when it's predefined", () => {
    expect(pageTypeToEndpoint('bag', 'woonplaats', '123')).toEqual(
      `${environment.API_ROOT}v1/bag/woonplaatsen/123/`,
    )

    expect(pageTypeToEndpoint('woningbouwplannen', 'woningbouwplan', '123')).toEqual(
      `${environment.API_ROOT}v1/woningbouwplannen/woningbouwplan/123/`,
    )
  })

  it('should return the correct endpoint type for the result', () => {
    expect(getEndpointTypeForResult('endpointType', {})).toBe('endpointType')
  })

  it('should return the correct endpoint type for the result when certain type', () => {
    expect(getEndpointTypeForResult(endpointTypes.adressenNummeraanduiding, {})).toBe(
      endpointTypes.adressenNummeraanduiding,
    )

    expect(
      getEndpointTypeForResult(endpointTypes.adressenNummeraanduiding, {
        ligplaats: true,
      }),
    ).toBe(endpointTypes.adressenLigplaats)

    expect(
      getEndpointTypeForResult(endpointTypes.adressenNummeraanduiding, {
        standplaats: true,
      }),
    ).toBe(endpointTypes.adressenStandplaats)
  })
})
