export const REDUCER_KEY = 'ui';
export const SET_BACKDROP = `${REDUCER_KEY}/SET_BACKDROP`;

export const initialState = {
  nrOfBackdropTriggers: 0
};

export default (state = initialState, action) => {
  switch (action.type) {
    // Increase or decrease the number of times the backdrop is triggered.
    // We do this so other triggers of show / hide backdrops won't overrule others while the
    // backdrop is active
    case SET_BACKDROP:
      return {
        ...state,
        nrOfBackdropTriggers: (action.payload) ?
          state.nrOfBackdropTriggers + 1 :
          (state.nrOfBackdropTriggers) ? state.nrOfBackdropTriggers - 1 : 0
      };

    default:
      return state;
  }
};

export const actions = {
  setBackDrop: SET_BACKDROP
};

