import { useEffect, useState } from 'react'

/**
 * Sometimes we want the user to control and watch the state of a component

 * @param [controlledState] The value to set the (initial) state
 * @param [onSetState] Function This will be called as soon as the state is changed
 */
const useControlledState = <T>(controlledState: T, onSetState: (value: T) => void) => {
  const [state, setState] = useState<T>(controlledState)

  useEffect(() => {
    setState(controlledState)
  }, [controlledState, setState])

  useEffect(() => {
    if (onSetState) {
      onSetState(state)
    }
  }, [state, onSetState])

  return [state, setState] as const
}

export default useControlledState
