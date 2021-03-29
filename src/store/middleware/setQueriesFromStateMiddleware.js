import paramsRegistry from '../params-registry'
import { getLocationType } from '../redux-first-router/selectors'
import isIgnoredPath from './isIgnoredPath'

const setQueriesFromStateMiddleware = ({ getState }) => (next) => (action) => {
  if (isIgnoredPath(window.location.pathname)) {
    return next(action)
  }

  const newAction = next(action)
  paramsRegistry.setQueriesFromState(getLocationType(getState()), getState(), action)
  return newAction
}

export default setQueriesFromStateMiddleware
