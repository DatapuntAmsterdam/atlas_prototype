import { useCallback, useEffect, useLayoutEffect, useReducer } from 'react'
import { useQuery } from 'urql'
import { QUERY_TYPES } from '../pages/SearchPage/config'

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value)
}

const getInitialState = (limit = 50, from = 0) => ({
  aggregatedResults: [],
  results: [],
  errors: [],
  fetchingMore: false,
  hasMore: false,
  from,
  totalCount: 0,
  limit,
  filters: [],
})

const RESET = 'RESET'
const SET_RESULTS = 'SET_RESULTS'
const SET_ERRORS = 'SET_ERRORS'
const SET_LIMIT = 'SET_LIMIT'

const reducer = (state, action) => {
  switch (action.type) {
    case RESET:
      return {
        ...action.payload,
      }

    case SET_LIMIT: {
      const limit = action.payload
      return {
        ...state,
        limit,
        from: state.from + limit,
        fetchingMore: limit > 0,
      }
    }

    case SET_RESULTS: {
      const { totalCount, results: newResults, filters } = action.payload

      let results = newResults

      if (state.fetchingMore) {
        // Results can be an object (direct results) or an array with results.
        results =
          state.results.length > 0 && state.results[0].results
            ? state.results.map(dataResult => {
                const matchedResult = newResults.find(result => result.type === dataResult.type)
                return {
                  ...dataResult,
                  results: [...dataResult.results, ...matchedResult.results],
                }
              })
            : [...state.results, ...newResults]
      }
      let count = totalCount
      if (results.length === 1) {
        ;[{ count }] = results
      }

      return {
        ...state,
        results,
        totalCount,
        filters,
        hasMore: count > state.limit + state.from, // Side-effect to show the "show more" button in the UI
        fetchingMore: false,
      }
    }

    case SET_ERRORS: {
      const { graphQLErrors } = action.payload

      return {
        ...state,
        errors: graphQLErrors.map(({ message, path, extensions }) => ({
          message,
          query: path[0],
          ...extensions,
        })),
      }
    }

    default:
      throw new Error(`Dispatched an unknown action: ${action.type}`)
  }
}

const usePagination = (config, input, sortString, limit, initialFrom) => {
  const initialState = getInitialState(limit, initialFrom)
  const [
    { totalCount, hasMore, results, errors, filters, from, fetchingMore },
    dispatch,
  ] = useReducer(reducer, initialState)

  let sort
  if (sortString && sortString.length) {
    const [field, order] = sortString.split(':')
    sort = {
      field,
      order,
    }
  }

  const [{ fetching, data, error }] = useQuery({
    query: config.query,
    variables: { limit, from, sort, ...input },
  })

  useLayoutEffect(() => {
    dispatch({ type: RESET, payload: initialState })
  }, [config.query, input.q, input.filters])

  const fetchMore = useCallback(() => {
    dispatch({ type: SET_LIMIT, payload: limit })
  }, [limit])

  useEffect(() => {
    if (data && !fetching) {
      // Todo: Check if this logic should be placed elsewhere, like by creating a specific query for the totalsearch
      if (Array.isArray(config.resolver)) {
        const allCounts = config.resolver.map(key => data[key] && data[key].totalCount)
        dispatch({
          type: SET_RESULTS,
          payload: {
            totalCount: allCounts.reduce((acc, cur) => acc + cur),
            results: config.resolver.map(key => {
              const type = getKeyByValue(QUERY_TYPES, key)
              const { results: dataResults = [], totalCount: dataTotalCount } = data[key] || {}

              return { type, results: dataResults, totalCount: dataTotalCount, filters: [] }
            }),
            filters: [],
          },
        })
      }

      if (data[config.resolver]) {
        const {
          results: dataResults = [],
          totalCount: dataTotalCount,
          filters: dataFilters = [],
        } = data[config.resolver]
        dispatch({
          type: SET_RESULTS,
          payload: {
            totalCount: dataTotalCount,
            results: dataResults,
            filters: dataFilters,
          },
        })
      }

      if (error) {
        dispatch({
          type: SET_ERRORS,
          payload: error,
        })
      }
    }
  }, [data, fetching, config.resolver])

  return {
    fetching,
    errors,
    totalCount,
    results,
    filters,
    fetchMore,
    hasMore,
    fetchingMore,
  }
}

export default usePagination
