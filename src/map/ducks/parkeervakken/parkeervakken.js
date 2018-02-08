export const FETCH_PARKEERVAKKEN = 'FETCH_PARKEERVAKKEN';
export const FETCH_PARKEERVAKKEN_SUCCESS = 'FETCH_PARKEERVAKKEN_SUCCESS';
export const FETCH_PARKEERVAKKEN_ERROR = 'FETCH_PARKEERVAKKEN_ERROR';
export const FETCH_PARKEERVAKKEN_GEOLOCATION = 'FETCH_PARKEERVAKKEN_GEOLOCATION';
export const FETCH_PARKEERVAKKEN_GEOLOCATION_SUCCESS = 'FETCH_PARKEERVAKKEN_GEOLOCATION_SUCCESS';
export const FETCH_PARKEERVAKKEN_GEOLOCATION_ERROR = 'FETCH_PARKEERVAKKEN_GEOLOCATION_ERROR';

const initialState = {
  selected: [],
  geolocation: {}
};

export default function ParkeervakkenReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_PARKEERVAKKEN:
      return {
        ...state
      };

    case FETCH_PARKEERVAKKEN_SUCCESS: {
      const retrievedIds = action.payload.map((vak) => vak.id);
      const selected = [...state.selected, ...retrievedIds]
            .filter((id) => !retrievedIds.some((newId) => (
            newId === id && state.selected.includes(newId))));
      return {
        ...state,
        selected
      };
    }

    case FETCH_PARKEERVAKKEN_GEOLOCATION_SUCCESS: {
      return {
        ...state,
        geolocation: action.payload
      };
    }

    default:
      return state;
  }
}

export const fetchParkeervakken = (latLong) => ({ type: FETCH_PARKEERVAKKEN, payload: latLong });

export const fetchParkeervakkenSuccess = (parkeervakken) => ({
  type: FETCH_PARKEERVAKKEN_SUCCESS,
  payload: parkeervakken
});

export const fetchParkeervakkenError = (error) => ({
  type: FETCH_PARKEERVAKKEN_ERROR,
  payload: error
});

export const fetchParkeervakkenGeolocation = () => ({ type: FETCH_PARKEERVAKKEN_GEOLOCATION });

export const fetchParkeervakkenGeolocationSuccess = (geolocation) => ({
  type: FETCH_PARKEERVAKKEN_GEOLOCATION_SUCCESS,
  payload: geolocation
});

export const fetchParkeervakkenGeolocationError = (geolocation) => ({
  type: FETCH_PARKEERVAKKEN_GEOLOCATION_ERROR,
  payload: geolocation
});

window.reducers = window.reducers || {};
window.reducers.ParkeervakkenReducer = ParkeervakkenReducer;
