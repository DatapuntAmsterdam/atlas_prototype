import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import encodeParam from './encodeParam'

type SetValueCallback<T> = (val: T) => T | null
type SetValueFn<T> = (value: T | null | SetValueCallback<T>, method?: 'push' | 'replace') => void

export interface UrlParam<T> {
  name: string
  defaultValue: T
  encode: (value: T) => string | null
  decode: (value: string) => T
}

const useParam = <T>(urlParam: UrlParam<T>): [T, SetValueFn<T>] => {
  const history = useHistory()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const rawValue = params.get(urlParam.name)
  const state = useMemo(() => (rawValue ? urlParam.decode(rawValue) : urlParam.defaultValue), [
    rawValue,
  ])

  // We need a ref here so that React is properly notified of changes in the component hierarchy for rendering.
  const stateRef = useRef(state)

  useEffect(() => {
    stateRef.current = state
  }, [stateRef, state])

  const setValue = useCallback<SetValueFn<T>>(
    (valueOrFn, method = 'push') => {
      const value = valueOrFn instanceof Function ? valueOrFn(stateRef.current) : valueOrFn
      const newParams = new URLSearchParams(window.location.search)

      // Hide the default value in the URL
      const newValue = encodeParam(urlParam, value)

      if (newValue) {
        newParams.set(urlParam.name, newValue)
      } else {
        newParams.delete(urlParam.name)
      }

      // We don't want the order to change, so always sort them before updating the URL
      newParams.sort()

      history[method]({ ...location, search: newParams.toString() })
    },
    [stateRef, location],
  )

  return [state, setValue]
}

export default useParam
