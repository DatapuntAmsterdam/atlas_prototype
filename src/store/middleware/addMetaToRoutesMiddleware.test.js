import addMetaToRoutesMiddleware from './addMetaToRoutesMiddleware'
import paramsRegistry from '../params-registry'

Object.defineProperties(global, {
  location: {
    writable: true,
    value: global.location,
  },
})

describe('addMetaToRoutesMiddleware', () => {
  let next
  let isRouterTypeMock
  const store = {
    getState: jest.fn(() => ({
      location: {
        type: '',
      },
    })),
  }

  const setState = (state) => {
    store.getState = jest.fn(() => state)
  }

  beforeEach(() => {
    paramsRegistry.isRouterType = jest.fn(() => true)
    isRouterTypeMock = jest.spyOn(paramsRegistry, 'isRouterType')
    next = jest.fn()
  })

  const nextMockAddMetaToRoutes = jest.fn()
  const actionMock = { type: 'some action', meta: { query: 'someQuery', preserve: true } }

  it('should skip when pathname includes "kaart"', () => {
    // @ts-ignore
    window.location = {
      pathname: '/kaart/foo/bar',
    }

    addMetaToRoutesMiddleware(store)(nextMockAddMetaToRoutes)(actionMock)
    expect(nextMockAddMetaToRoutes).toHaveBeenCalledWith(actionMock)

    expect(isRouterTypeMock).not.toHaveBeenCalled()
  })

  it('should use the custom middleware when pathname does not includes "kaart"', () => {
    // @ts-ignore
    window.location = {
      pathname: '/data/foo/bar',
      search: '?foo=bar',
    }

    addMetaToRoutesMiddleware(store)(nextMockAddMetaToRoutes)(actionMock)

    expect(isRouterTypeMock).toHaveBeenCalled()
  })

  it("should not enrich the action.meta if it's not a route", () => {
    paramsRegistry.isRouterType = jest.fn(() => false)
    const action = { type: 'some type ' }
    addMetaToRoutesMiddleware(store)(next)(action)
    expect(next).toHaveBeenCalledWith(action)
  })

  it("should add isFirstAction to the action's meta", () => {
    const action = { type: 'some type' }
    addMetaToRoutesMiddleware(store)(next)(action)
    expect(next).toHaveBeenCalledWith({
      ...action,
      meta: { isFirstAction: true },
    })
  })

  it("should not add isFirstAction to the action's meta if locationType is equal to action.type are the same", () => {
    setState({
      location: {
        type: 'some type',
      },
    })
    const action = { type: 'some type' }
    addMetaToRoutesMiddleware(store)(jest.fn())(action)
    addMetaToRoutesMiddleware(store)(next)(action)
    expect(next).toHaveBeenCalledWith(action)
  })
})
