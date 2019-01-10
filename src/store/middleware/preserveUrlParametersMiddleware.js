import paramsRegistry from '../params-registry';
import { getLocationQuery } from '../redux-first-router/selectors';

const preserveUrlParametersMiddleware = ({ getState }) => (next) => (action) => {
  let nextAction = action;
  if (nextAction.meta && (nextAction.meta.preserve || nextAction.meta.additionalParams)) {
    const additionalParams = nextAction.meta.additionalParams;
    nextAction = {
      ...nextAction,
      meta: {
        ...nextAction.meta,
        query: {
          ...(nextAction.meta.query) ? nextAction.meta.query : {},
          ...paramsRegistry.getParametersForRoute(getLocationQuery(getState()), action.type, false),
          ...(additionalParams) ?
            paramsRegistry.getParametersForRoute(additionalParams, action.type) :
            {}
        }
      }
    };

    delete nextAction.meta.preserve;
  }

  return next(nextAction);
};

export default preserveUrlParametersMiddleware;
