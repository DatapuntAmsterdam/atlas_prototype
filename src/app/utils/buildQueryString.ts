import { UrlParam } from './useParam'
import encodeParam from './encodeParam'

function buildQueryString<T>(entries: [UrlParam<T>, T][]) {
  const newUrlQuery = new URLSearchParams(window.location.search)
  entries.forEach(([param, value]) => {
    const newValue = encodeParam(param, value)
    if (newValue) {
      newUrlQuery.set(param.name, newValue)
    } else {
      newUrlQuery.delete(param.name)
    }

    // We don't want the order to change, so always sort them before updating the URL
  })
  newUrlQuery.sort()

  return newUrlQuery.toString()
}

export default buildQueryString
