import paramsRegistry from '../params-registry';
import { getLocationType } from '../redux-first-router/selectors';

const urlParamsMiddleWare = ({ getState }) => (next) => (action) => {
  const nextAction = next(action);
  paramsRegistry.setQueriesFromState(getLocationType(getState()), getState());
  return nextAction;
};

export default urlParamsMiddleWare;
