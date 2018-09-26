import stateUrlConverter from '../../shared/services/routing/state-url-converter';
import ACTIONS from '../../shared/actions';

/**
 * @param {Object} oldState
 *
 * @returns {Object} newState
 */
function showHomeReducer(state) {
  const defaultState = stateUrlConverter.getDefaultState();
  return {
    ...defaultState,
    ui: {
      ...defaultState.ui,
      isEmbed: state.ui.isEmbed,
      isEmbedPreview: state.ui.isEmbedPreview,
      isPrintMode: state.ui.isPrintMode
    }
  };
}

const reducers = {};

reducers[ACTIONS.SHOW_HOME] = showHomeReducer;

export default reducers;
