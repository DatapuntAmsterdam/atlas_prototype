import encodeParam from './encodeParam'
import { UrlParam } from './useParam'

export default function buildQueryString<T>(params: [UrlParam<T>, T][]) {
  const searchParams = new URLSearchParams(window.location.search)

  params.forEach(([param, value]) => {
    const newValue = encodeParam(param, value)

    if (newValue) {
      searchParams.set(param.name, newValue)
    } else {
      searchParams.delete(param.name)
    }
  })

  // We don't want the order to change, so always sort them before updating the URL
  searchParams.sort()

  return searchParams.toString()
}
