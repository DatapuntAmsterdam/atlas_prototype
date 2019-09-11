import SHARED_CONFIG from '../../../shared/services/shared-config/shared-config'
import { getAuthHeaders } from '../../../shared/services/auth/auth'

// Minimun length for typeahead query in backend is 3 characters
const MIN_QUERY_LENGTH = 3

function formatData(categories) {
  const numberOfResults = categories.reduce((acc, category) => acc + category.content.length, 0)
  let indexInTotal = -1

  const indexedCategories = categories.map(category => ({
    ...category,
    content: category.content.map(suggestion => {
      indexInTotal += 1
      return {
        category: category.label,
        index: indexInTotal,
        label: suggestion._display,
        uri: suggestion.uri,
      }
    }),
  }))

  return {
    count: numberOfResults,
    data: indexedCategories,
  }
}

function search(query) {
  const uri =
    query && query.length >= MIN_QUERY_LENGTH && `${SHARED_CONFIG.API_ROOT}typeahead?q=${query}`

  if (uri) {
    return fetch(uri, { headers: getAuthHeaders() })
      .then(response => response.json())
      .then(response => formatData(response))
  }
  return {}
}

export default search
