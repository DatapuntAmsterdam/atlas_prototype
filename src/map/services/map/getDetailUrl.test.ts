import { ServiceDefinition } from '../map-services.config'
import { getDetailUrl } from './getDetailUrl'
import environment from '../../../environment'

describe('getDetailUrl', () => {
  it('should create a detail URL from the service definition', () => {
    const serviceDefinition = {
      endpoint: 'v1/grex/projecten',
    } as ServiceDefinition

    expect(getDetailUrl(serviceDefinition, '1234')).toEqual(
      `${environment.API_ROOT}v1/grex/projecten/1234/`,
    )
  })
})
