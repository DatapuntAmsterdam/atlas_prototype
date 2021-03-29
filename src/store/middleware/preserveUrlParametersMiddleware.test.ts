import preserveUrlParametersMiddleware from './preserveUrlParametersMiddleware'
import paramsRegistry from '../params-registry'

describe('logic of redux middleware for preserving url parameters', () => {
  const getParametersForRouteMock = jest.spyOn(paramsRegistry, 'getParametersForRoute')

  const nextMockPreserveUrlParametersMiddleware = jest.fn()
  const action = { type: 'some action', meta: { query: 'someQuery', preserve: true } }

  it('should skip when pathname includes "kaart"', () => {
    const locationSpy = jest.spyOn(window, 'location', 'get').mockReturnValue({
      ...window.location,
      ...{ pathname: '/kaart' },
    })

    preserveUrlParametersMiddleware()(nextMockPreserveUrlParametersMiddleware)(action)
    expect(nextMockPreserveUrlParametersMiddleware).toHaveBeenCalledWith(action)

    expect(getParametersForRouteMock).not.toHaveBeenCalled()

    locationSpy.mockRestore()
  })

  it('should use the custom middleware when pathname includes "kaarten"', () => {
    const locationSpy = jest.spyOn(window, 'location', 'get').mockReturnValue({
      ...window.location,
      ...{ pathname: '/kaarten' },
    })

    preserveUrlParametersMiddleware()(nextMockPreserveUrlParametersMiddleware)(action)

    expect(getParametersForRouteMock).toHaveBeenCalled()

    locationSpy.mockRestore()
  })

  it('should use the custom middleware when pathname does not include "kaart"', () => {
    preserveUrlParametersMiddleware()(nextMockPreserveUrlParametersMiddleware)(action)

    expect(getParametersForRouteMock).toHaveBeenCalled()
  })
})
