import ACTIONS, { FETCH_SEARCH_RESULTS_BY_LOCATION } from '../../shared/actions';
import BaseCoder from '../../shared/services/base-coder/base-coder';
import isObject from '../../shared/services/is-object';

/**
 * @param {Object} state
 * @param {String} payload - A search query
 *
 * @returns {Object} newState
 */
function fetchSearchResultsByQueryReducer(state, payload) {
  return {
    ...state,
    search: {
      isLoading: true,
      isFullscreen: true,
      query: payload || null,
      location: null,
      category: null,
      numberOfResults: null
    },
    ui: isObject(state.ui) ? {
      ...state.ui,
      isMapPanelVisible: false,
      isMapFullscreen: false
    } : state.ui,
    page: isObject(state.page) ? {
      ...state.page,
      name: null,
      type: null
    } : state.page,
    detail: null,
    straatbeeld: null,
    dataSelection: null
  };
}

/**
 * @param {Object} state
 * @param {Array} payload - A location, e.g. [52.123, 4.789]
 *
 * @returns {Object} newState
 */
function fetchSearchResultsByLocationReducer(state, payload) {
  return {
    ...state,
    search: {
      isLoading: true,
      isFullscreen: false,
      query: null,
      location: BaseCoder.toPrecision(payload, 7),
      category: null,
      numberOfResults: null
    },
    map: isObject(state.map) ? {
      ...state.map,
      geometry: []
    } : state.map,
    page: isObject(state.page) ? {
      ...state.page,
      name: null
    } : state.page,
    detail: null,
    straatbeeld: null,
    dataSelection: null
  };
}

/**
 * @param {Object} state
 * @param {String} payload - A reference to the slug of a SEARCH_CONFIG endpoint
 *
 * @returns {Object} newState
 */
function fetchSearchResultsCategoryReducer(state, payload) {
  return {
    ...state,
    search: isObject(state.search) ? {
      ...state.search,
      isLoading: true,
      category: payload,
      numberOfResults: null
    } : state.search
  };
}

/**
 * @param {Object} oldState
 * @param {String} payload - The number of search results
 *
 * @returns {Object} newState
 */
function showSearchResultsReducer(state, payload) {
  return {
    ...state,
    search: isObject(state.search) ? {
      ...state.search,
      isLoading: false,
      numberOfResults: payload
    } : state.search,
    map: isObject(state.map) ? {
      ...state.map,
      isLoading: false
    } : state.map
  };
}

const reducers = {};

reducers[ACTIONS.FETCH_SEARCH_RESULTS_BY_QUERY] = fetchSearchResultsByQueryReducer;
reducers[FETCH_SEARCH_RESULTS_BY_LOCATION] = fetchSearchResultsByLocationReducer;
reducers[ACTIONS.FETCH_SEARCH_RESULTS_CATEGORY] = fetchSearchResultsCategoryReducer;
reducers[ACTIONS.SHOW_SEARCH_RESULTS] = showSearchResultsReducer;

export default reducers;
