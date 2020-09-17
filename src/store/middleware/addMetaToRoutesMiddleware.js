import { get } from 'lodash'
import paramsRegistry from '../params-registry'

let nrOfRoutesDispatched = 0

const addMetaToRoutesMiddleware = ({ getState }) => (next) => (action) => {
  if (paramsRegistry.isRouterType(action)) {
    if (getState().location.type !== action.type || get(action, 'meta.location.kind') === 'pop') {
      nrOfRoutesDispatched = 0
    }

    const firstAction = nrOfRoutesDispatched === 0

    nrOfRoutesDispatched += 1
    const nextAction = action
    const meta = {
      ...(nextAction && nextAction.meta ? { ...nextAction.meta } : {}),
      ...(firstAction ? { firstAction } : {}),
    }
    return next({
      ...nextAction,
      ...(Object.keys(meta).length ? { meta } : {}),
    })
  }

  return next(action)
}

export default addMetaToRoutesMiddleware
