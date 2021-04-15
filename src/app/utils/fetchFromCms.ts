import { fetchWithToken } from '../../shared/services/api/api'
import { Single } from '../../api/cms/article'
import cmsJsonApiNormalizer from '../../shared/services/cms/cms-json-api-normalizer'
import normalizeCMSResults from '../../normalizations/cms/normalizeCMSResults'
import { DoubleNormalizedResults, NormalizedFieldItems } from '../../normalizations/cms/types'

const fetchSingleFromCms = (endpoint: string, fields: string[]) =>
  fetchWithToken<Single>(endpoint).then((data) => {
    const normalizedResults = normalizeCMSResults(
      cmsJsonApiNormalizer(data, fields),
    ) as NormalizedFieldItems
    return {
      ...normalizedResults,
      // @ts-ignore
      field_blocks: normalizedResults.field_blocks?.map(({ field_content, ...otherFields }) => ({
        ...otherFields,
        field_content: normalizeCMSResults(field_content),
      })),
      // @ts-ignore
      field_items:
        normalizedResults.field_items && normalizeCMSResults(normalizedResults.field_items),
    } as DoubleNormalizedResults
  })

const fetchListFromCms = (endpoint: string, fields: string[]) =>
  fetchWithToken(endpoint).then((data) => {
    const tempResult = cmsJsonApiNormalizer(data, fields)
    return normalizeCMSResults(tempResult) as NormalizedFieldItems[]
  })

export { fetchListFromCms, fetchSingleFromCms }
