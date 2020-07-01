import { ServiceDefinition } from '../map-services.config'
import { getDetailUrl } from './getDetailUrl'

describe('getDetailUrl', () => {
  const API_ROOT = 'http://example.com'
  const originalEnv = process.env

  beforeEach(() => {
    process.env = {
      API_ROOT,
    }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('should create a detail URL from the service definition', () => {
    const serviceDefinition = {
      endpoint: 'v1/grex/projecten',
    } as ServiceDefinition

    expect(getDetailUrl(serviceDefinition, '1234')).toEqual(`${API_ROOT}/v1/grex/projecten/1234`)
  })

  it('should throw an exception if the API_ROOT is not set', () => {
    process.env = {}

    const serviceDefinition = {
      endpoint: 'v1/grex/projecten',
    } as ServiceDefinition

    expect(() => getDetailUrl(serviceDefinition, '1234')).toThrow()
  })
})
