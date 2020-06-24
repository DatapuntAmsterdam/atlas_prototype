/* eslint-disable camelcase */
import React from 'react'
import { To } from 'redux-first-router-link'
import useNormalizedCMSResults from '../../normalizations/cms/useNormalizedCMSResults'
import { fetchWithToken } from '../../shared/services/api/api'
import cmsJsonApiNormalizer from '../../shared/services/cms/cms-json-api-normalizer'

export type CMSConfig = {
  endpoint: (id?: string) => string
  fields?: Array<string>
}

// More fields should be added to this type when other CMS content pages are migrated to TypeScript
export type CMSResultItem = {
  id: string
  type: string
  specialType: string | null
  title: string
  shortTitle?: string
  teaser: string
  linkProps: Object
  teaserImage?: string
  coverImage?: string
  to?: To
}

export type CMSResults<T> = {
  loading: boolean
  fetchData: Function
  error: boolean
  results?: T
}

function useFromCMS<T = CMSResultItem[]>(
  config: CMSConfig,
  id?: string,
  normalizeFromJSONApi = true,
): CMSResults<T> {
  const [results, setResults] = React.useState<T>()
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)

  const fetchData = async (endpoint: string) => {
    setLoading(true)
    setError(false)
    setResults(undefined)
    try {
      if (!endpoint) {
        // eslint-disable-next-line no-param-reassign
        endpoint = id ? config.endpoint(id) : config.endpoint()
      }

      const { fields } = config
      const data = await fetchWithToken(endpoint)

      let result = data
      if (normalizeFromJSONApi) {
        result = cmsJsonApiNormalizer(data, fields)
      }

      // Todo: Need to refactor this when we really know what types and fields to expect from the CMS
      // This if-statement is an "exeption" for the CollectionDetail pages.
      if (result.field_blocks && result.field_items) {
        result = {
          ...result,
          // @ts-ignore
          field_blocks: result.field_blocks.map(({ field_content, ...otherFields }) => ({
            ...otherFields,
            field_content: useNormalizedCMSResults(field_content),
          })),
          field_items: useNormalizedCMSResults(result.field_items),
        }
      } else {
        result = useNormalizedCMSResults(result)
      }
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
