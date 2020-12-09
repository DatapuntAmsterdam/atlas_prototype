import paramsRegistry from '../params-registry'
import { getLocationType } from '../redux-first-router/selectors'

const urlParamsMiddleWare = ({ getState }) => (next) => (action) => {
  if (window.location.pathname.includes('kaart')) {
    return next(action)
  }
  const newAction = next(action)
  paramsRegistry.setQueriesFromState(getLocationType(getState()), getState(), action)
  return newAction
}

export default urlParamsMiddleWare
