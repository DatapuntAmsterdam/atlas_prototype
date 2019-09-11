const useRequestDuck = (namespace = 'default') => {
  const initState = {
    loading: false,
    results: [],
    error: false,
  }

  const types = {
    request: `${namespace}/REQUEST`,
    success: `${namespace}/SUCCESS`,
    accumulateResults: `${namespace}/SUCCESS_APPEND`,
    failure: `${namespace}/FAILURE`,
  }

  const selectors = {
    results: ({ results }) => {
      return results.results || []
    },
    count: state => state.results && state.results.count,
  }

  const actions = {
    request: () => ({
      type: types.request,
    }),
    success: payload => ({
      type: types.success,
      payload,
    }),
    accumulateResults: payload => ({
      type: types.accumulateResults,
      payload,
    }),
    failure: payload => ({
      type: types.failure,
      payload,
    }),
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case types.request:
        return {
          ...state,
          loading: true,
          error: false,
        }
      case types.success:
        return {
          error: false,
          loading: false,
          results: action.payload,
        }
      case types.accumulateResults:
        return {
          error: false,
          loading: false,
          results: {
            ...action.payload,
            results: [...state.results.results, ...action.payload.results],
          },
        }
      case types.failure:
        return {
          ...state,
          loading: false,
          error: action.payload,
        }

      default:
        return initState
    }
  }

  const RequestDuck = {
    reducer,
    actions,
    selectors,
    initState,
    namespace,
  }

  Object.freeze(RequestDuck)

  return RequestDuck
}

export default useRequestDuck
