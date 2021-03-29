import paramsRegistry from '../params-registry'
import ParamsRegistry from '../params-registry/paramRegistry'
import { getLocationQuery } from '../redux-first-router/selectors'
import isIgnoredPath from './isIgnoredPath'

const preserveUrlParametersMiddleware = () => (next) => (action) => {
  let nextAction = action

  if (isIgnoredPath(window.location.pathname)) {
    return next(nextAction)
  }

  if (nextAction.meta && (nextAction.meta.preserve || nextAction.meta.additionalParams)) {
    const { additionalParams } = nextAction.meta
    const { preserve } = nextAction.meta
    const newQuery = {
      ...(nextAction.meta.query ? nextAction.meta.query : {}),
      ...(preserve
        ? paramsRegistry.getParametersForRoute(getLocationQuery(), action.type, false)
        : {}),
      ...(additionalParams
        ? paramsRegistry.getParametersForRoute(additionalParams, action.type)
        : {}),
    }

    const query = ParamsRegistry.orderQuery(
      paramsRegistry.removeParamsWithDefaultValue(newQuery, action.type),
    )

    nextAction = {
      ...nextAction,
      meta: {
        ...nextAction.meta,
        query,
      },
    }

    delete nextAction.meta.additionalParams
    delete nextAction.meta.preserve
  }

  return next(nextAction)
}

export default preserveUrlParametersMiddleware
