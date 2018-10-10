import ACTIONS from '../../shared/actions';
import isObject from '../../shared/services/is-object';
import { routing } from '../../app/routes';

/**
 * @description If the oldState had an active straatbeeld it will remember the heading.
 *
 * @param {Object} state
 * @param {Object} payload - {id: 'abc123', heading: 90}
 *
 * @returns {Object} newState
 */
function fetchStraatbeeldByIdReducer(state) {
  return {
    ...state,
    search: null,
    dataSelection: null
  };
}

/**
 * @param {Object} oldState
 * @param {Array} payload - A location, e.g. [52.123, 4.789]
 *
 * @returns {Object} newState
 */
function fetchStraatbeeldByLocationReducer(state, payload) {
  const map = isObject(state.map) ? { ...state.map } : state.map;

  if (state.ui && (state.ui.isMapPanelVisible || state.ui.isMapFullscreen)) {
    map.viewCenter = payload;
  }

  return {
    ...state,
    map: {
      ...map
    },
    ui: isObject(state.ui) ? {
      ...state.ui,
      isMapPanelVisible: false,
      isMapFullscreen: false
    } : state.ui,
    page: isObject(state.page) ? {
      ...state.page,
      name: null
    } : state.page,
    search: null,
    dataSelection: null,
    detail: null
  };
}

const reducers = {};

reducers[routing.mapPanorama.type] = fetchStraatbeeldByIdReducer;
reducers[ACTIONS.FETCH_STRAATBEELD_BY_ID] = fetchStraatbeeldByIdReducer;
reducers[ACTIONS.FETCH_STRAATBEELD_BY_HOTSPOT] = fetchStraatbeeldByIdReducer;
reducers[ACTIONS.FETCH_STRAATBEELD_BY_LOCATION] = fetchStraatbeeldByLocationReducer;

export default reducers;
