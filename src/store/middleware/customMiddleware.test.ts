import addMetaToRoutesMiddleware from './addMetaToRoutesMiddleware'
import preserveUrlParametersMiddleware from './preserveUrlParametersMiddleware'
import setQueriesFromStateMiddleware from './setQueriesFromStateMiddleware'
import paramsRegistry from '../params-registry'

Object.defineProperties(global, {
  location: {
    writable: true,
    value: global.location,
  },
})

describe('Custom Redux Middleware', () => {
  const isRouterTypeMock = jest.spyOn(paramsRegistry, 'isRouterType')
  const setQueriesFromStateMock = jest.spyOn(paramsRegistry, 'setQueriesFromState')
  const getParametersForRouteMock = jest.spyOn(paramsRegistry, 'getParametersForRoute')
  const mockStore = {
    getState: jest.fn(() => ({
      location: {
        type: '',
      },
    })),
  }

  const nextMockAddMetaToRoutes = jest.fn()
  const nextMockPreserveUrlParametersMiddleware = jest.fn()
  const action = { type: 'some action', meta: { query: 'someQuery', preserve: true } }

  it('should skip when pathname includes "kaart"', () => {
    // @ts-ignore
    window.location = {
      pathname: '/kaart/foo/bar',
    }

    addMetaToRoutesMiddleware(mockStore)(nextMockAddMetaToRoutes)(action)
    expect(nextMockAddMetaToRoutes).toHaveBeenCalledWith(action)

    preserveUrlParametersMiddleware()(nextMockPreserveUrlParametersMiddleware)(action)
    expect(nextMockPreserveUrlParametersMiddleware).toHaveBeenCalledWith(action)

    setQueriesFromStateMiddleware(mockStore)(jest.fn)(action)

    expect(setQueriesFromStateMock).not.toHaveBeenCalled()
    expect(isRouterTypeMock).not.toHaveBeenCalled()
    expect(getParametersForRouteMock).not.toHaveBeenCalled()
  })

  it('should use the custom middleware when pathname does not includes "kaart"', () => {
    // @ts-ignore
    window.location = {
      pathname: '/data/foo/bar',
      search: '?foo=bar',
    }

    addMetaToRoutesMiddleware(mockStore)(nextMockAddMetaToRoutes)(action)

    preserveUrlParametersMiddleware()(nextMockPreserveUrlParametersMiddleware)(action)

    setQueriesFromStateMiddleware(mockStore)(jest.fn)(action)

    expect(setQueriesFromStateMock).toHaveBeenCalled()
    expect(isRouterTypeMock).toHaveBeenCalled()
    expect(getParametersForRouteMock).toHaveBeenCalled()
  })
})
