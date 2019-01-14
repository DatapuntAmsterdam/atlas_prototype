import { routing } from '../../../app/routes';
import { SET_GEOMETRY_FILTER } from '../data-selection/constants';

export const REDUCER_KEY = 'selection';

export const SET_SELECTION = `${REDUCER_KEY}/SET_SELECTION`;
export const CLEAR_SELECTION = `${REDUCER_KEY}/CLEAR_SELECTION`;

export const SELECTION_TYPE = {
  NONE: 'NONE',
  POINT: 'POINT',
  OBJECT: 'OBJECT',
  PANORAMA: 'PANORAMA'
};

export const initialState = {
  type: SELECTION_TYPE.NONE
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case routing.dataDetail.type:
      return {
        type: SELECTION_TYPE.OBJECT
      };

    case routing.panorama.type:
      return {
        type: SELECTION_TYPE.PANORAMA,
        id: action.payload.id
      };

    case routing.home.type:
    case SET_GEOMETRY_FILTER:
      return {
        ...initialState
      };

    case SET_SELECTION:
      return {
        type: action.payload
      };

    case CLEAR_SELECTION: {
      return {
        type: SELECTION_TYPE.NONE
      };
    }
    default:
      return state;
  }
};

// Selectors
export const previewDataAvailable = (state) =>
  // If either an object is selected or a point search is in progress, show preview panel
  state.selection.type === SELECTION_TYPE.POINT
  || state.selection.type === SELECTION_TYPE.OBJECT
  ;

export const getSelectionType = (state) => (state[REDUCER_KEY].type);
export const isGeoSearch = (state) => state[REDUCER_KEY].type === SELECTION_TYPE.POINT;

// Action creators
export const setSelection = (payload) => ({
  type: SET_SELECTION,
  payload
});

export default reducer;
