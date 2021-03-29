import setQueriesFromStateMiddleware from './setQueriesFromStateMiddleware'
import paramsRegistry from '../params-registry'

describe('logic of redux middleware for setting queries from state', () => {
  const isRouterTypeMock = jest.spyOn(paramsRegistry, 'isRouterType')
  const setQueriesFromStateMock = jest.spyOn(paramsRegistry, 'setQueriesFromState')
  const mockStore = {
    getState: jest.fn(() => ({
      location: {
        type: '',
      },
    })),
  }

  const action = { type: 'some action', meta: { query: 'someQuery', preserve: true } }

  it('should skip custom middleware when pathname includes "kaart"', () => {
    const locationSpy = jest
      .spyOn(window, 'location', 'get')
      .mockReturnValue({ pathname: '/kaart' } as Location)

    setQueriesFromStateMiddleware(mockStore)(jest.fn)(action)

    expect(setQueriesFromStateMock).not.toHaveBeenCalled()
    expect(isRouterTypeMock).not.toHaveBeenCalled()

    locationSpy.mockRestore()
  })

  it('should use custom middleware when pathname includes "kaarten"', () => {
    const locationSpy = jest
      .spyOn(window, 'location', 'get')
      .mockReturnValue({ pathname: '/kaarten', search: '?foo=bar' } as Location)

    setQueriesFromStateMiddleware(mockStore)(jest.fn)(action)

    expect(setQueriesFromStateMock).toHaveBeenCalled()
    expect(isRouterTypeMock).toHaveBeenCalled()

    locationSpy.mockRestore()
  })

  it('should use the custom middleware when pathname does not include "kaart"', () => {
    setQueriesFromStateMiddleware(mockStore)(jest.fn)(action)

    expect(setQueriesFromStateMock).toHaveBeenCalled()
    expect(isRouterTypeMock).toHaveBeenCalled()
  })
})
