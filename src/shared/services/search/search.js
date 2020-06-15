// Todo: fix / add tests
import { fetchWithToken } from '../api/api'
import { formatLinks } from './search-formatter'

export function loadMore(category) {
  return fetchWithToken(category.next).then((nextPageData) => {
    // Don't change the input, create a new variable
    const output = {}

    output.slug = category.slug
    output.count = nextPageData.count
    output.results = category.results.concat(formatLinks(category.slug, nextPageData.results))

    if (output.count > output.results.length) {
      output.next = nextPageData._links.next.href
    } else {
      output.next = null
    }

    return output
  })
}

// @TODO remove the exception when backend uses correct sub type name tg-3551
export function replaceBuurtcombinatie(searchResults) {
  const results = [...searchResults]
  results.forEach((result) => {
    result.results.forEach((item) => {
      if (item.subtype === 'buurtcombinatie') {
        item.subtypeLabel = 'wijk' // eslint-disable-line no-param-reassign
      }
    })
  })

  return results
}

export function getNumberOfResults(searchResults) {
  return searchResults.reduce(
    (previous, current) =>
      previous +
      current.count +
      (current.subResults
        ? current.subResults.reduce((subPrevious, subCurrent) => subPrevious + subCurrent.count, 0)
        : 0),
    0,
  )
}

export const getNumberOfResultsPanel = (results) =>
  results.reduce((acc, { results: subResults }) => acc + subResults.length, 0)
