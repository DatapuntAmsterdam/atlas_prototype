import paramsRegistry from '../../store/params-registry'

export function getFromURL(params: string[]) {
  return params.map((param) => paramsRegistry.getParam(param))
}

export default function watchForChanges(
  param: string,
  state: any,
  dispatchAction: Function,
  replace: boolean = false,
) {
  const paramValue = paramsRegistry.getParam(param)

  // The URL should be updated if there is a value for state (not including empty arrays)
  if (
    state &&
    (!Array.isArray(state) || (Array.isArray(state) && state.length)) &&
    JSON.stringify(state) !== JSON.stringify(paramValue)
  ) {
    paramsRegistry.setParam(param, state, replace)

    return
  }

  // Update the state if the URL does not match the state
  if (paramValue && JSON.stringify(paramValue) !== JSON.stringify(state)) {
    dispatchAction(paramValue)
  }
}
