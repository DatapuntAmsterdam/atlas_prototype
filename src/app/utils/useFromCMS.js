import React from 'react'
import { getByUrl } from '../../shared/services/api/api'
import cmsNormalizer from '../../shared/services/cms/cms-normalizer'
import useNormalizedCMSResults from '../../normalizations/cms/useNormalizedCMSResults'

function useFromCMS(config, id = false, normalize = true) {
  const [results, setResults] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)

  const fetchData = async endpoint => {
    setLoading(true)
    try {
      if (!endpoint) {
        // eslint-disable-next-line no-param-reassign
        endpoint = id ? config.endpoint(id) : config.endpoint()
      }

      const { fields } = config
      const data = await getByUrl(endpoint)

      let result = data
      if (normalize) {
        result = await cmsNormalizer(data, fields)
      }

      result = await useNormalizedCMSResults(result, config.type)
      setResults(result)
    } catch (e) {
      setError(true)
    }

    setLoading(false)
    return results
  }

  return {
    loading,
    fetchData,
    results,
    error,
  }
}

export default useFromCMS
