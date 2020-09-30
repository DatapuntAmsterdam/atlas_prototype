import { UrlParam } from './useParam'

const buildParamQuery = <T>(urlParam: UrlParam<T>, newValue: string | null): URLSearchParams => {
  const newParams = new URLSearchParams(window.location.search)

  if (newValue) {
    newParams.set(urlParam.name, newValue)
  } else {
    newParams.delete(urlParam.name)
  }

  // We don't want the order to change, so always sort them before updating the URL
  newParams.sort()

  return newParams
}

export default buildParamQuery
