import ACTIONS from '../shared/actions';

export default (stateUrlConverter) => {
  function urlChangeReducer(oldState, payload) {
    return stateUrlConverter.params2state(oldState, payload);
  }

  return {
    [ACTIONS.URL_CHANGE]: urlChangeReducer
  };
};
