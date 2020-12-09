import preserveUrlParametersMiddleware from './preserveUrlParametersMiddleware'
import paramsRegistry from '../params-registry'

Object.defineProperties(global, {
  location: {
    writable: true,
    value: global.location,
  },
})

describe('Custom Redux Middleware', () => {
  const getParametersForRouteMock = jest.spyOn(paramsRegistry, 'getParametersForRoute')

  const nextMockPreserveUrlParametersMiddleware = jest.fn()
  const action = { type: 'some action', meta: { query: 'someQuery', preserve: true } }

  it('should skip when pathname includes "kaart"', () => {
    // @ts-ignore
    window.location = {
      pathname: '/kaart/foo/bar',
    }

    preserveUrlParametersMiddleware()(nextMockPreserveUrlParametersMiddleware)(action)
    expect(nextMockPreserveUrlParametersMiddleware).toHaveBeenCalledWith(action)

    expect(getParametersForRouteMock).not.toHaveBeenCalled()
  })

  it('should use the custom middleware when pathname does not includes "kaart"', () => {
    // @ts-ignore
    window.location = {
      pathname: '/data/foo/bar',
      search: '?foo=bar',
    }

    preserveUrlParametersMiddleware()(nextMockPreserveUrlParametersMiddleware)(action)

    expect(getParametersForRouteMock).toHaveBeenCalled()
  })
})
