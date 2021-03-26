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
  const mockStore = {
    getState: jest.fn(() => ({
      location: {
        type: '',
      },
    })),
  }

  const action = { type: 'some action', meta: { query: 'someQuery', preserve: true } }

  it('should skip when pathname includes "kaart"', () => {
    // @ts-ignore
    window.location = {
      pathname: '/kaart/foo/bar',
    }

    setQueriesFromStateMiddleware(mockStore)(jest.fn)(action)

    expect(setQueriesFromStateMock).not.toHaveBeenCalled()
    expect(isRouterTypeMock).not.toHaveBeenCalled()
  })

  it('should use the custom middleware when pathname includes "kaarten"', () => {
    // @ts-ignore
    window.location = {
      pathname: '/kaarten/foo/bar',
      search: '?foo=bar',
    }

    setQueriesFromStateMiddleware(mockStore)(jest.fn)(action)

    expect(setQueriesFromStateMock).toHaveBeenCalled()
    expect(isRouterTypeMock).toHaveBeenCalled()
  })

  it('should use the custom middleware when pathname does not include "kaart"', () => {
    // @ts-ignore
    window.location = {
      pathname: '/data/foo/bar',
      search: '?foo=bar',
    }

    setQueriesFromStateMiddleware(mockStore)(jest.fn)(action)

    expect(setQueriesFromStateMock).toHaveBeenCalled()
    expect(isRouterTypeMock).toHaveBeenCalled()
  })
})
