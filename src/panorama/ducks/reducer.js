import { PANORAMA_CONFIG } from '../services/panorama-api/panorama-api';
import PAGES from '../../app/pages';
import {
  FETCH_PANORAMA_ERROR,
  FETCH_PANORAMA_HOTSPOT_REQUEST,
  FETCH_PANORAMA_REQUEST,
  FETCH_PANORAMA_SUCCESS,
  initialState,
  REDUCER_KEY,
  SET_PANORAMA_LOCATION,
  SET_PANORAMA_ORIENTATION,
  SET_PANORAMA_TAGS
} from './constants';
import paramsRegistry from '../../store/params-registry';
import { shouldResetState } from '../../store/redux-first-router/actions';

export { REDUCER_KEY as PANORAMA };

export default function reducer(state = initialState, action) {
  if (shouldResetState(action, [PAGES.PANORAMA])) {
    return initialState;
  }

  const enrichedState = {
    ...state,
    ...paramsRegistry.getStateFromQueries(REDUCER_KEY, action)
  };

  switch (action.type) {
    case FETCH_PANORAMA_HOTSPOT_REQUEST:
    case FETCH_PANORAMA_REQUEST:
      return {
        ...enrichedState,
        isLoading: true,
        targetLocation: null
      };

    case SET_PANORAMA_TAGS:
      return {
        ...enrichedState,
        tags: action.payload
      };

    case FETCH_PANORAMA_SUCCESS:
      return {
        ...enrichedState,
        id: action.payload.id,
        date: action.payload.date,
        pitch: enrichedState.pitch || initialState.pitch,
        fov: enrichedState.fov || PANORAMA_CONFIG.DEFAULT_FOV,
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

    case SET_PANORAMA_LOCATION:
      return {
        ...enrichedState,
        location: action.payload,
        targetLocation: action.payload,
        detailReference: initialState.detailReference
      };

    default:
      return enrichedState;
  }
}

