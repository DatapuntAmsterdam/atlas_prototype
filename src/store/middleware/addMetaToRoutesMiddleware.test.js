import addMetaToRoutesMiddleware from './addMetaToRoutesMiddleware'
import paramsRegistry from '../params-registry'

describe('addMetaToRoutesMiddleware', () => {
  let next
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
    next = jest.fn()
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
