import { getAuthHeaders } from '../../../shared/services/auth/auth'
import { CmsType } from '../../../shared/config/cms.config'
import SearchType from '../../../app/pages/SearchPage/constants'
import environment from '../../../environment'

// Minimun length for typeahead query in backend is 3 characters
const MIN_QUERY_LENGTH = 3

// Todo: Please consider rewriting the way we keep track on the active (selected) item in the
// autosuggest result list. Now we use an (arbitrary) high number for more results button ("..."),
// so this wont conflict with the activeSuggestion indexes.
export const MORE_RESULTS_INDEX = 999

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
 * @param {Array} results
 * @returns {*[]}
 */
export const orderAutoSuggestResults = (results) => {
  // Sort order of the autosuggest results
  const order = SORT_ORDER

  const dataPart = results.filter((category) => !order.includes(category.label))
  const orderedPart = order.reduce((acc, label) => {
    const res = results.filter((category) => category.label === label)
    if (res) {
      return [...acc, ...res]
    }
    return acc
  }, [])
  return [...dataPart, ...orderedPart]
}

function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value)
}

function formatData(categories, categoryType) {
  const numberOfResults = categories.reduce((acc, category) => acc + category.content.length, 0)
  const sortedCategories = orderAutoSuggestResults(categories)
    .map((category) => {
      const type =
        getKeyByValue(LABELS, category.label) ||
        (LABELS_MAP.includes(category.label) ? SearchType.Map : SearchType.Data)

      return { ...category, type }
    })
    .filter(({ type }) => {
      // Filter out the matching categoryTypes
      if (categoryType && categoryType !== type) {
        return false
      }

      return true
    })

  let indexInTotal = -1

  const indexedCategories = sortedCategories.map((category) => ({
    ...category,
    totalResults: category.total_results,
    content: category.content.map((suggestion) => {
      indexInTotal += 1
      return {
        category: category.label,
        index: indexInTotal,
        label: suggestion._display,
        uri: suggestion.uri,
        type: category.type,
      }
    }),
  }))

  return {
    count: numberOfResults,
    data: indexedCategories,
  }
}

async function search({ query, type }) {
  const uri =
    query &&
    query.length >= MIN_QUERY_LENGTH &&
    `${environment.API_ROOT}typeahead?q=${typeof query === 'string' ? query.toLowerCase() : ''}` // Todo: temporary fix, real fix: DP-7365

  if (uri) {
    const response = await fetch(uri, { headers: getAuthHeaders() })
    const json = await response.json()

    return formatData(json, type)
  }
  return {}
}

export default search
