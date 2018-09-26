import ACTIONS from '../../shared/actions';
import isObject from '../../shared/services/is-object';

/**
 * @param {Object} state
 * @param {String} payload - The name of the page, it should match the name
 *                              of an HTML template from the page
 * module
 *
 * @returns {Object} newState
 */
function showPageReducer(state, payload) {
  return {
    ...state,
    page: isObject(state.page) ? {
      ...state.page,
      name: payload.name,
      type: payload.type,
      item: payload.item
    } : state.page,
    ui: isObject(state.ui) ? {
      ...state.ui,
      isMapPanelVisible: false,
      isMapFullscreen: false
    } : state.ui,
    search: null,
    detail: null,
    straatbeeld: null,
    dataSelection: null
  };
}

const reducers = {};

reducers[ACTIONS.SHOW_PAGE] = showPageReducer; // TODO refactor, destroy page reducer

export default reducers;
