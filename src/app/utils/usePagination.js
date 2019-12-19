import React, { useEffect, useState } from 'react'
import { useQuery } from 'urql'
import { QUERY_TYPES } from '../pages/SearchPage/config'

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value)
}

const usePagination = (config, input, limit = 50, initialFrom = 0) => {
  const [aggregatedResults, setAggregatedResults] = React.useState([])
  const [hasMore, setHasMore] = React.useState(true)
  const [from, setFrom] = React.useState(initialFrom)

  const [totalCount, setTotalCount] = useState(0)
  const [dataResults, setDataResults] = useState([])
  const [filters, setFilters] = useState([])

  const [{ fetching, data, error }] = useQuery({
    query: config.query,
    variables: { limit, from, ...input },
  })

  React.useMemo(() => {
    // When the input query changes the from value must be resetted
    setFrom(initialFrom)
  }, [input.q])

  // Reset the state
  // React.useEffect(() => {
  //   setAggregatedResults([])
  //   setTotalCount(0)
  //   setFilters([])
  //   setFrom(initialFrom)
  // }, [config])

  const fetchMore = React.useCallback(() => {
    setFrom(s => s + limit)
  }, [limit])

  useEffect(() => {
    if (data && !fetching) {
      // Check if this logic should be placed elsewhere, like by creating a specific query for the totalsearch
      if (Array.isArray(config.resolver)) {
        const allCounts = config.resolver.map(key => data[key] && data[key].totalCount)
        setTotalCount(allCounts.reduce((acc, cur) => acc + cur))

        setDataResults(
          config.resolver.map(key => {
            const type = getKeyByValue(QUERY_TYPES, key)
            const { results = [], totalCount: dataTotalCount } = data[key]

            return { type, results, totalCount: dataTotalCount, filters: [] }
          }),
        )
      }

      if (data[config.resolver]) {
        const { results = [], totalCount: dataTotalCount, filters: dataFilters = [] } = data[
          config.resolver
        ]
        setTotalCount(dataTotalCount)
        setDataResults(results)
        setFilters(dataFilters)
      }
    }
  }, [data, fetching, config.resolver])

  useEffect(() => {
    setHasMore(!(totalCount <= limit + from))
  }, [totalCount, limit, from])

  useEffect(() => {
    setAggregatedResults(current => [...current, ...dataResults])
  }, [dataResults])

  return [
    { data, fetching, error },
    { totalCount, dataResults, aggregatedResults, filters },
    fetchMore,
    hasMore,
  ]
}

export default usePagination
