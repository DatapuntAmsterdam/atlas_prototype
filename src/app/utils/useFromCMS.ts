/* eslint-disable camelcase */
import { LocationDescriptorObject } from 'history'
import { useState } from 'react'
import { To } from 'redux-first-router-link'
import normalizeCMSResults from '../../normalizations/cms/normalizeCMSResults'
import { CmsType, SpecialType } from '../../shared/config/cms.config'
import { fetchWithToken } from '../../shared/services/api/api'
import cmsJsonApiNormalizer from '../../shared/services/cms/cms-json-api-normalizer'
import { Single } from '../../api/cms/article'
import { DoubleNormalizedResults, NormalizedFieldItems } from '../../normalizations/cms/types'

export interface CMSConfig {
  endpoint(id?: string): string
  endpoint(id: string): string
  fields: Array<string>
}

// More fields should be added to this type when other CMS content pages are migrated to TypeScript
export interface CMSResultItem {
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

function useFromCMS<T = Single | DoubleNormalizedResults | NormalizedFieldItems[]>(
  config: CMSConfig,
  id?: string,
  normalizeFromJSONApi = true,
) {
  const [results, setResults] = useState<T>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchData = (endpoint?: string) => {
    setLoading(true)
    setError(false)
    setResults(undefined)

    if (!endpoint) {
      // eslint-disable-next-line no-param-reassign
      endpoint = id ? config.endpoint(id) : config.endpoint()
    }

    const { fields } = config

    fetchWithToken<Single>(endpoint)
      .then((data) => {
        let result: any = data
        if (normalizeFromJSONApi) {
          const tempResult = cmsJsonApiNormalizer(data, fields)
          // Todo: Need to refactor this when we really know what types and fields to expect from the CMS
          // This if-statement is an "exeption" for the CollectionDetail pages.
          if (!(tempResult instanceof Array) && tempResult.field_blocks && tempResult.field_items) {
            result = {
              ...tempResult,
              // @ts-ignore
              field_blocks: tempResult.field_blocks.map(({ field_content, ...otherFields }) => ({
                ...otherFields,
                field_content: normalizeCMSResults(field_content),
              })),
              field_items: normalizeCMSResults(tempResult.field_items),
            } as DoubleNormalizedResults
          } else {
            // NormalizedFieldItems[]
            result = normalizeCMSResults(tempResult) as NormalizedFieldItems[]
          }
        }

        setResults(result)
      })
      .catch(() => {
        setError(true)
      })
      .finally(() => {
        setLoading(false)
      })

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
