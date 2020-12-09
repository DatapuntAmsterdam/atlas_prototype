import isEqual from 'lodash.isequal'
import { UrlParam } from './useParam'

function encodeParam<T>(urlParam: UrlParam<T>, value: T) {
  const encodedValue = value && urlParam.encode(value)
  return isEqual(urlParam.defaultValue, value) ? null : encodedValue
}

export default encodeParam
