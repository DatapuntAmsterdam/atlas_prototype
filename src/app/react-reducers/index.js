import uiReducer, {
  actions as UIActions,
  initialState as initialUIState,
  REDUCER_KEY as UI
} from './ui';

const mainReducer = ({ ui }, action) => ({
  [UI]: uiReducer(ui, action)
});

export const initialState = {
  [UI]: initialUIState
};

const actions = {
  [UI]: UIActions
};

/**
 * Returns an object with available actions for the specific reducer
 * @param dispatch
 * @param reducerKey
 * @returns {{}}
 */
export const actionsCreator = (dispatch, reducerKey) =>
  Object.entries(actions[reducerKey]).reduce((acc, [action, constant]) => ({
    ...acc,
    [action]: (args) => dispatch({ type: constant, ...args })
  }), {});

export default mainReducer;
