import React from 'react'
import { fetchWithToken } from '../../shared/services/api/api'

function useDataFetching() {
  const [results, setResults] = React.useState(null)
  const [errorMessage, setErrorMessage] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  async function fetchData(endpoint: string) {
    setLoading(true)
    try {
      const data = await fetchWithToken(endpoint)
      setResults(data)
    } catch (e) {
      setErrorMessage(e.message)
    }

    setLoading(false)
    return results
  }

  return {
    errorMessage,
    loading,
    results,
    fetchData,
  }
}

export default useDataFetching
