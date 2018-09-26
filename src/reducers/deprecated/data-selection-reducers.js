/* eslint-disable no-mixed-operators */
import ACTIONS from '../../shared/actions';
import isObject from '../../shared/services/is-object';

/**
 * @param {Object} state
 * @param {string|Object} payload A string with the search query or
 *                                an object with the following keys:
 *                                - query (String): The search query
 *                                - filters (Object): Active filters
 *                                Except these two keys, other keys
 *                                will be copied if they are in the
 *                                object, but no defualt value will be
 *                                provided.
 *
 * @returns {Object} newState
 */
// eslint-disable-next-line complexity
function fetchDataSelectionReducer(state, payload) {
  const mergeInto = typeof payload === 'string' ? {
    query: payload,
    page: 1,
    view: 'CATALOG',
    dataset: 'dcatd'
  } : payload;

  const view = mergeInto.view || state.dataSelection && state.dataSelection.view || 'TABLE';

  const geometryFilter = mergeInto.resetGeometryFilter
    ? {
      markers: [],
      description: ''
    }
    : state.dataSelection && state.dataSelection.geometryFilter ||
      {
        markers: [],
        description: ''
      };

  const filters = mergeInto.filters
    ? mergeInto.filters
    : (mergeInto.emptyFilters
      ? {}
      : { ...state.filters });

  delete mergeInto.resetGeometryFilter;
  delete mergeInto.emptyFilters;
  delete mergeInto.filters;

  return {
    ...state,
    dataSelection: {
      ...(isObject(state.dataSelection) ? state.dataSelection : ''),
      ...mergeInto,
      markers: [],
      view,
      isLoading: true,
      isFullscreen: view !== 'LIST',
      geometryFilter: { ...geometryFilter }
    },
    map: isObject(state.map) ? {
      ...state.map,
      // LIST loading might include markers => set map loading accordingly
      isLoading: view === 'LIST'
    } : state.map,
    filters,
    page: isObject(state.page) ? {
      ...state.page,
      name: null
    } : state.page,
    ui: isObject(state.ui) ? {
      ...state.ui,
      isMapPanelVisible: false,
      isMapFullscreen: false
    } : state.ui,
    search: null,
    detail: null,
    straatbeeld: null
  };
}

/**
 * @param {Object} state
 * @param {Array} payload - Markers for the leaflet.markercluster plugin
 *
 * @returns {Object} newState
 */
function showDataSelectionReducer(state, payload) {
  return {
    ...state,
    dataSelection: isObject(state.dataSelection) ? {
      ...state.dataSelection,
      markers: payload,
      isLoading: false,
      isFullscreen: state.dataSelection.view !== 'LIST'
    } : state.dataSelection,
    map: isObject(state.map) ? {
      ...state.map,
      isLoading: false
    } : state.map
  };
}

/**
 * Does the same as `showDataSelectionReducer`, but will not trigger a
 * url state change.
 *
 * @param {Object} state
 * @param {Array} payload - Markers for the leaflet.markercluster plugin
 *
 * @returns {Object} newState
 */
function resetDataSelectionReducer(state, payload) {
  return {
    ...state,
    dataSelection: isObject(state.dataSelection) ? {
      ...state.dataSelection,
      markers: payload,
      isLoading: false,
      isFullscreen: state.dataSelection.view !== 'LIST',
      reset: false
    } : state.dataSelection,
    map: isObject(state.map) ? {
      ...state.map,
      isLoading: false
    } : state.map
  };
}

/**
 * @param {Object} state
 * @param {Number} payload - The destination page
 *
 * @returns {Object} newState
 */
function navigateDataSelectionReducer(state, payload) {
  return {
    ...state,
    dataSelection: isObject(state.dataSelection) ? {
      ...state.dataSelection,
      page: payload
    } : state.dataSelection
  };
}

/**
 * @param {Object} state
 * @param {String} payload
 *
 * @returns {Object} newState
 */
function setDataSelectionViewReducer(state, payload) {
  const views = ['LIST', 'TABLE', 'CATALOG'];
  const viewFound = views.indexOf(payload) !== -1;
  const view = viewFound ? payload : undefined;

  return {
    ...state,
    dataSelection: isObject(state.dataSelection) ? {
      ...state.dataSelection,
      view,
      isLoading: viewFound
    } : state.dataSelection,
    map: isObject(state.map) ? {
      ...state.map,
      isLoading: view === 'LIST'
    } : state.map
  };
}


const reducers = {};

reducers[ACTIONS.FETCH_DATA_SELECTION] = fetchDataSelectionReducer;
reducers[ACTIONS.SHOW_DATA_SELECTION] = showDataSelectionReducer;
reducers[ACTIONS.RESET_DATA_SELECTION] = resetDataSelectionReducer;
reducers[ACTIONS.NAVIGATE_DATA_SELECTION] = navigateDataSelectionReducer;
reducers[ACTIONS.SET_DATA_SELECTION_VIEW] = setDataSelectionViewReducer;

export default reducers;
