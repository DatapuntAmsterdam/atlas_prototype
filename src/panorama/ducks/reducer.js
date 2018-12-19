import { ROUTER_NAMESPACE, routing } from '../../app/routes';
import { PANORAMA_CONFIG } from '../services/panorama-api/panorama-api';
import PAGES from '../../app/pages';
import {
  CLOSE_PANORAMA,
  FETCH_PANORAMA_ERROR,
  FETCH_PANORAMA_REQUEST,
  FETCH_PANORAMA_SUCCESS,
  initialState, SET_PANORAMA_LOCATION,
  SET_PANORAMA_ORIENTATION,
  SET_PANORAMA_VIEW,
  SET_PANORAMA_YEAR,
  FETCH_PANORAMA_REQUEST_TOGGLE
} from './constants';
import { getStateFromQuery } from '../../store/query-synchronization';
import urlParams from './query';

export { REDUCER_KEY } from './constants';

export default function reducer(state = initialState, action) {
  if (action.type &&
    action.type.startsWith(ROUTER_NAMESPACE) &&
    !action.type.includes(PAGES.PANORAMA)
  ) {
    return initialState;
  }

  const enrichedState = {
    ...state,
    ...getStateFromQuery(urlParams, action)
  };
  switch (action.type) {
    case routing.panorama.type: {
      return {
        ...enrichedState,
        id: action.payload.id
      };
    }

    case FETCH_PANORAMA_REQUEST:
      return {
        ...enrichedState,
        id: action.payload.id,
        isLoading: true
      };

    case FETCH_PANORAMA_REQUEST_TOGGLE:
      return {
        ...state,
        history: action.payload
      };

    case SET_PANORAMA_YEAR:
      return {
        ...enrichedState,
        year: action.payload
      };

    case FETCH_PANORAMA_SUCCESS:
      return {
        ...enrichedState,
        date: action.payload.date,
        pitch: state.pitch || initialState.pitch,
        fov: state.fov || PANORAMA_CONFIG.DEFAULT_FOV,
        hotspots: action.payload.hotspots,
        isLoading: false,
        location: action.payload.location,
        image: action.payload.image
      };
    case FETCH_PANORAMA_ERROR:
      return {
        ...enrichedState,
        isLoading: false,
        isError: true // TODO: refactor, show error
      };

    case SET_PANORAMA_ORIENTATION:
      return {
        ...enrichedState,
        heading: action.payload.heading,
        pitch: action.payload.pitch,
        fov: action.payload.fov
      };

    case CLOSE_PANORAMA:
      return {
        ...enrichedState,
        location: initialState.location,
        image: initialState.image
      };

    case SET_PANORAMA_VIEW:
      return {
        ...enrichedState,
        view: action.payload
      };

    case SET_PANORAMA_LOCATION:
      return {
        ...enrichedState,
        location: action.payload
      };

    default:
      return enrichedState;
  }
}

