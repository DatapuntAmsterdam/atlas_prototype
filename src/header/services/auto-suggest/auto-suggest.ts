import SearchType from '../../../app/pages/SearchPage/constants'
import joinUrl from '../../../app/utils/joinUrl'
import environment from '../../../environment'
import { CmsType } from '../../../shared/config/cms.config'
import { fetchWithToken } from '../../../shared/services/api/api'

// Minimun length for typeahead query in backend is 3 characters
export const MIN_QUERY_LENGTH = 3

// Sort order of the data results. These strings correspond to the labels defined in the typeahead API.
export const LABELS_DATA = [
  'Straatnamen',
  'Adressen',
  'Openbare ruimtes',
  'Panden',
  'Gebieden',
  'Vestigingen',
  'Maatschappelijke activiteiten',
  'Kadastrale objecten',
  'Kadastrale subjecten',
  'Meetbouten',
  'Monumenten',
]

// Sort order of the map results. These strings correspond to the labels defined in the typeahead API.
export const LABELS_MAP = ['Kaartcollecties', 'Kaartlagen']

// These strings correspond to the labels defined in the typeahead API, and reflect the correct order in the autosuggest results
export const LABELS = {
  [CmsType.Collection]: 'Dossiers',
  [CmsType.Special]: 'Specials',
  [SearchType.Map]: LABELS_MAP,
  [SearchType.Data]: LABELS_DATA,
  [SearchType.Dataset]: 'Datasets',
  [CmsType.Publication]: 'Publicaties',
  [CmsType.Article]: 'Artikelen',
}

export const SORT_ORDER = Object.values(LABELS).flat()

/**
 * Orders the array by the object's labels in the order defined the SORT_ORDER const
 */
export function sortResponse(response: TypeaheadItem[]) {
  const dataPart = response.filter((item) => !SORT_ORDER.includes(item.label))
  const orderedPart = SORT_ORDER.reduce((acc, label) => {
    const res = response.filter((item) => item.label === label)
    if (res) {
      return [...acc, ...res]
    }
    return acc
  }, [] as TypeaheadItem[])

  return [...dataPart, ...orderedPart]
}

function formatResponse(
  response: TypeaheadItem[],
  itemType: string | undefined,
): AutoSuggestSearchResult[] {
  const sortedResponse = sortResponse(response)
    .map((item) => {
      // Base the type on the label returned from the API.
      const type =
        Object.keys(LABELS).find((key) => LABELS[key] === item.label) ||
        (LABELS_MAP.includes(item.label) ? SearchType.Map : SearchType.Data)

      return { ...item, type }
    })
    .filter(({ type }) => {
      // Filter out the matching type
      return !(itemType && itemType !== type)
    })

  let indexInTotal = -1

  const indexedResponse = sortedResponse.map((item) => ({
    ...item,
    totalResults: item.total_results,
    content: item.content.map((content) => {
      indexInTotal += 1
      return {
        category: item.label,
        index: indexInTotal,
        label: content._display,
        uri: content.uri,
        type: item.type,
        subType: (item.type === 'data' && content._display.toLowerCase()) || undefined,
      }
    }),
  }))

  return indexedResponse
}

// TODO: Generate these types from the OpenAPI spec: https://api.data.amsterdam.nl/typeahead/openapi
interface TypeaheadItem {
  label: string
  content: TypeaheadContent[]
  // eslint-disable-next-line camelcase
  total_results: number
}

interface TypeaheadContent {
  _display: string
  uri: string
  type?: string
}

export interface SearchOptions {
  query: string
  type?: string
}

// TODO: Revisit the interfaces below if they can be more like the source they came from.
export interface AutoSuggestSearchResult {
  type: string
  label: string
  totalResults: number
  content: AutoSuggestSearchContent[]
}

export interface AutoSuggestSearchContent {
  category: string
  index: number
  label: string
  uri: string
  type: string
  subType?: string
}

export default async function autoSuggestSearch({ query, type }: SearchOptions) {
  const url = joinUrl([environment.API_ROOT, 'typeahead'])
  const response = await fetchWithToken<TypeaheadItem[]>(url, { q: query.toLowerCase() })

  return formatResponse(response, type)
}
