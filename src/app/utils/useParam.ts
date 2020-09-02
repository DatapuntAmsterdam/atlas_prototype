import deepEqual from 'deep-equal'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

type SetValueCallback<T> = (val: T) => T | null
type SetValueFn<T> = (value: T | null | SetValueCallback<T>, method?: 'push' | 'replace') => void

export interface UrlParam<T> {
  name: string
  defaultValue: T
  encode: (value: T) => string | null
  decode: (value: string) => T
  showDefaultValueInQuery?: boolean
}

const useParam = <T>(urlParam: UrlParam<T>): [T, SetValueFn<T>] => {
  const history = useHistory()
  const location = useLocation()

  if (history === undefined || location === undefined) {
    throw new Error('useParam must be used within a <BrowserRouter /> from react-router-dom')
  }

  const params = new URLSearchParams(location.search)
  const rawValue = params.get(urlParam.name)
  const state = useMemo(() => (rawValue ? urlParam.decode(rawValue) : urlParam.defaultValue), [
    rawValue,
  ])

  // We use a ref here in case the current state / value needs to be retrieved from an event handler
  const stateRef = useRef(state)
  useEffect(() => {
    stateRef.current = state
  }, [stateRef, state])

  const setValue = useCallback<SetValueFn<T>>(
    (valueOrFn, method = 'push') => {
      const newParams = new URLSearchParams(window.location.search)
      // @ts-ignore
      const value = typeof valueOrFn === 'function' ? valueOrFn(stateRef.current) : valueOrFn
      const encodedValue = value && urlParam.encode(value)

      // Check if we don't want to show the default value in the URL
      const newValue =
        !urlParam.showDefaultValueInQuery && deepEqual(urlParam.defaultValue, value)
          ? null
          : encodedValue

      if (newValue) {
        newParams.set(urlParam.name, newValue)
      } else {
        newParams.delete(urlParam.name)
      }

      // We don't want the order to change, so always sort them before updating the URL
      newParams.sort()

      history[method]({ ...location, search: newParams.toString() })
    },
    [stateRef],
  )

  return [state, setValue]
}

export default useParam
