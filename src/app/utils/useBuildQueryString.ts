import { useLocation } from 'react-router-dom'
import encodeParam from './encodeParam'
import { UrlParam } from './useParam'

export default function useBuildQueryString() {
  const location = useLocation()
  const buildQueryString = <T>(
    paramsToAdd?: [UrlParam<T>, T][],
    paramsToOmit?: Array<UrlParam<any>>,
  ) => {
    const searchParams = new URLSearchParams(location.search)

    paramsToAdd?.forEach(([param, value]) => {
      const newValue = encodeParam(param, value)

      if (newValue !== null) {
        searchParams.set(param.name, newValue)
      } else {
        searchParams.delete(param.name)
      }
    })

    paramsToOmit?.forEach((param) => {
      searchParams.delete(param.name)
    })

    // We don't want the order to change, so always sort them before updating the URL
    searchParams.sort()

    return searchParams.toString()
  }

  return { buildQueryString }
}
