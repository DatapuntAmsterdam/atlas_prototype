import ACTIONS from '../../shared/actions';

/**
 * @param {Object} state
 * @param {Object} payload
 *
 * @returns {Object} newState
 */
function applyFiltersReducer(state, payload) {
  return {
    ...state,
    filters: { ...payload }
  };
}

/**
 * @param {Object} state
 *
 * @returns {Object} newState
 */
function emptyFiltersReducer(state) {
  return {
    ...state,
    filters: {}
  };
}

const reducers = {};

reducers[ACTIONS.APPLY_FILTERS] = applyFiltersReducer;
reducers[ACTIONS.EMPTY_FILTERS] = emptyFiltersReducer;

export default reducers;
