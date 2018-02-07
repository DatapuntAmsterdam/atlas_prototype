export const FETCH_PARKEERVAKKEN = 'FETCH_PARKEERVAKKEN';
export const FETCH_PARKEERVAKKEN_SUCCESS = 'FETCH_PARKEERVAKKEN_SUCCESS';
export const FETCH_PARKEERVAKKEN_ERROR = 'FETCH_PARKEERVAKKEN_ERROR';

const initialState = {
  selected: []
};

export default function ParkeervakkenReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_PARKEERVAKKEN:
      return {
        ...state
      };

    case FETCH_PARKEERVAKKEN_SUCCESS:
      return {
        ...state,
        selected: [...new Set([...state.selected, ...action.payload])]
      };

    default:
      return state;
  }
}

export const fetchParkeervakken = (latLong) => ({ type: FETCH_PARKEERVAKKEN, latLong });

export const fetchParkeervakkenSuccess = (parkeervakken) => ({
  type: FETCH_PARKEERVAKKEN_SUCCESS,
  payload: parkeervakken
});
export const fetchParkeervakkenError = (error) => ({
  type: FETCH_PARKEERVAKKEN_ERROR,
  payload: error
});

window.reducers = window.reducers || {};
window.reducers.ParkeervakkenReducer = ParkeervakkenReducer;
