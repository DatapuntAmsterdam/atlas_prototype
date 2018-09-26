import isObject from '../is-object';
import ACTIONS, { FETCH_SEARCH_RESULTS_BY_LOCATION } from '../../actions';

// DEPRECATED
const contextMiddleware = (store) => (next) => (action) => {
  // Straatbeeld and detail can both exist in an invisible state
  // An invisible straatbeeld or detail determines the meaning of some events
  // These events are thus context sensitive and therefore handled by this middleware
  const { straatbeeld } = store.getState();

  const nextAction = action;

  if (action.type) {
    if (action.type === ACTIONS.MAP_CLICK) {
      if (isObject(straatbeeld)) {
        // a MAP CLICK when straatbeeld is active fetches the most nearby straatbeeld
        nextAction.type = ACTIONS.FETCH_STRAATBEELD_BY_LOCATION;
      } else {
        // the default action for a MAP CLICK is to show the search results for that location
        nextAction.type = FETCH_SEARCH_RESULTS_BY_LOCATION;
      }
    }
  }

  return next(nextAction);
  /* eslint-enable complexity */
};

export default contextMiddleware;
