import isEqual from 'lodash.isequal'
import { UrlParam } from './useParam'

function encodeParam<T>(urlParam: UrlParam<T>, value: T) {
  if (isEqual(urlParam.defaultValue, value)) {
    return null
  }

  if (value === undefined || value === null) {
    return null
  }

  return urlParam.encode(value as NonNullable<T>)
}

export default encodeParam
