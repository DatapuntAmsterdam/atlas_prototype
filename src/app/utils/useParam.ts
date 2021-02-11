import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import buildParamQuery from './buildParamQuery'
import encodeParam from './encodeParam'

type SetValueCallback<T> = (val: T) => T | null
type SetValueFn<T> = (value: T | null | SetValueCallback<T>, method?: 'push' | 'replace') => void

export interface UrlParam<T> {
  name: string
  // When the parameter isn't set in the URL, the value of that parameter is the default value.
  // When setting the value of that parameter to the default value, the parameter will be removed from the URL
  defaultValue: T
  // Optional initial value that can be used if the value to be set is unknown
  initialValue?: T
  decode: (value: string) => T
  encode: (value: T) => string | null
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

  const setValue = useCallback<SetValueFn<T>>((valueOrFn, method = 'push') => {
    const value = valueOrFn instanceof Function ? valueOrFn(stateRef.current) : valueOrFn
    const newValue = value ? encodeParam(urlParam, value) : null
    const newParams = buildParamQuery(urlParam, newValue)

    if (location.pathname !== window.location.pathname) {
      throw new Error(
        `There's a mismatch between window.location and the location from the useLocation hook from react-router. This sometimes happens when calling the 'setValue' inside a non-react event-handler that is not updated. Please be sure the component is updated via react-router.
        Tried to update parameter with key: "${urlParam.name}"`,
      )
    }
    return history[method]({ ...location, search: newParams.toString() })
  }, [])

  return [state, setValue]
}

export default useParam
