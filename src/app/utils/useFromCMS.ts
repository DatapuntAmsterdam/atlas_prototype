/* eslint-disable camelcase */
import { LocationDescriptorObject } from 'history'
import { useState } from 'react'
import { To } from 'redux-first-router-link'
import normalizeCMSResults from '../../normalizations/cms/normalizeCMSResults'
import { CmsType, SpecialType } from '../../shared/config/cms.config'
import { fetchWithToken } from '../../shared/services/api/api'
import cmsJsonApiNormalizer from '../../shared/services/cms/cms-json-api-normalizer'

export type CMSConfig = {
  endpoint: (id?: string) => string
  fields?: Array<string>
}

// More fields should be added to this type when other CMS content pages are migrated to TypeScript
export type CMSResultItem = {
  linkProps?: {
    to?: To | LocationDescriptorObject
    forwardedAs?: never
    title: string
    href?: string
  }
  to?: To
  id: string | null
  label: string | null
  type: CmsType | null
  date: string | null
  slug: string | null
  intro: string | null
  teaser: string | null
  dateLocale: string
  teaserImage: string | null
  coverImage: string | null
  specialType: SpecialType | null
  title?: string | null
  shortTitle?: string | null
  link: {
    uri: string | null
  } | null
}

export type CMSResults<T> = {
  loading: boolean
  fetchData: (endpoint?: string) => Promise<T | undefined>
  error: boolean
  results?: T
}

function useFromCMS<T = CMSResultItem[]>(
  config: CMSConfig,
  id?: string,
  normalizeFromJSONApi = true,
): CMSResults<T> {
  const [results, setResults] = useState<T>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchData = async (endpoint?: string) => {
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
            field_content: normalizeCMSResults(field_content),
          })),
          field_items: normalizeCMSResults(result.field_items),
        }
      } else {
        result = normalizeCMSResults(result)
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
