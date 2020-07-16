import paramsRegistry from '../../store/params-registry'
import watchForChanges, { getFromURL } from './watchForChanges'
import getState from '../../shared/services/redux/get-state'

jest.mock('../../shared/services/redux/get-state')

const MOCK_PARAM_VALUE = 'result for param'

beforeEach(() => {
  paramsRegistry.getParam = jest.fn(() => MOCK_PARAM_VALUE)
  paramsRegistry.setParam = jest.fn()
  getState.mockReturnValue({
    location: 'LOCATION',
  })

  jest.spyOn(paramsRegistry, 'getParam')
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('getFromURL', () => {
  it('should return all the params that are requested', () => {
    const output = getFromURL(['PARAM'])

    expect(paramsRegistry.getParam).toBeCalledWith('PARAM')
    expect(output[0]).toBe(MOCK_PARAM_VALUE)
  })
})

describe('watchForChanges', () => {
  const dispatchMock = jest.fn()

  afterEach(() => {
    dispatchMock.mockReset()
  })

  it('should update the URL if there is a value for state', () => {
    watchForChanges('PARAM', null, dispatchMock)

    expect(paramsRegistry.getParam).toBeCalledWith('PARAM')
    expect(paramsRegistry.setParam).not.toBeCalled()
    expect(dispatchMock).toBeCalledWith(MOCK_PARAM_VALUE) // If the param shouldn't be updated, the state must as the value for the URL and the state are different

    watchForChanges('PARAM', 'value', jest.fn())

    expect(paramsRegistry.setParam).toBeCalledWith('PARAM', 'value', false)
    expect(dispatchMock).toBeCalledTimes(1) // Should not update the state again
  })

  it('but not when the value for state is an empty array', () => {
    watchForChanges('PARAM', [], dispatchMock)

    expect(paramsRegistry.setParam).not.toBeCalled()
    expect(dispatchMock).toBeCalledWith(MOCK_PARAM_VALUE) // If the param shouldn't be updated, the state must as the value for the URL and the state are different
  })

  it('or the value is equal to the existing value in the state', () => {
    watchForChanges('PARAM', MOCK_PARAM_VALUE, jest.fn())

    expect(paramsRegistry.setParam).not.toBeCalled()
    expect(dispatchMock).not.toBeCalled() // Also don't update the state as the values are the same
  })

  it('and use a replace action if requested', () => {
    watchForChanges('PARAM', 'value', dispatchMock, true)

    expect(paramsRegistry.setParam).toBeCalledWith('PARAM', 'value', true)
  })

  it('should update the state if the URL does not match the state', () => {
    watchForChanges('PARAM', '', dispatchMock)

    expect(paramsRegistry.getParam).toBeCalledWith('PARAM')
    expect(dispatchMock).toBeCalledWith(MOCK_PARAM_VALUE)
  })
})
