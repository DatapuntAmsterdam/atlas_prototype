import { mocked } from 'ts-jest/utils'
import { getServiceDefinitions, ServiceDefinition } from '../map-services.config'
import { getServiceDefinition } from './getServiceDefinition'

jest.mock('../map-services.config')

const mockedServiceDefinitions = mocked(getServiceDefinitions, true)

describe('getServiceDefinition', () => {
  it('should return a service definition', () => {
    const serviceDefinition = {
      type: 'foo/bar',
    } as ServiceDefinition

    mockedServiceDefinitions.mockReturnValue([serviceDefinition])
    expect(getServiceDefinition('foo/bar')).toEqual(serviceDefinition)
  })

  it('should return null if no service definition could be found', () => {
    mockedServiceDefinitions.mockReturnValue([])
    expect(getServiceDefinition('foo/bar')).toEqual(null)
  })
})
