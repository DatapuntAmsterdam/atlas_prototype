import deepEqual from 'deep-equal'
import { UrlParam } from './useParam'

function encodeParam<T>(urlParam: UrlParam<T>, value: T | null) {
  const encodedValue = value && urlParam.encode(value)
  const newValue = deepEqual(urlParam.defaultValue, value) ? null : encodedValue
  return newValue
}

export default encodeParam
