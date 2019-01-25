import PAGES from '../../../app/pages';
import { shouldResetState } from '../../../store/redux-first-router/actions';
import {
  FETCH_DATA_SELECTION_FAILURE,
  FETCH_DATA_SELECTION_REQUEST,
  FETCH_DATA_SELECTION_SUCCESS, FETCH_MARKERS_FAILURE,
  FETCH_MARKERS_REQUEST,
  FETCH_MARKERS_SUCCESS,
  initialState,
  REDUCER_KEY,
  REMOVE_GEOMETRY_FILTER,
  RESET_DATA_SELECTION,
  ROUTE_DATASET_MAPPER,
  SET_DATASET,
  SET_GEOMETRY_FILTER,
  SET_PAGE
} from './constants';
import { routing } from '../../../app/routes';
import { SET_SELECTION } from '../selection/selection';
import { FETCH_MAP_DETAIL_SUCCESS } from '../../../map/ducks/detail/constants';
import paramsRegistry from '../../../store/params-registry';

export { REDUCER_KEY as DATA_SELECTION };

export default function reducer(state = initialState, action) {
  if (shouldResetState(action, [PAGES.ADDRESSES, PAGES.ESTABLISHMENTS, PAGES.CADASTRAL_OBJECTS])) {
    return initialState;
  }
  const enrichedState = {
    ...state,
    ...paramsRegistry.getStateFromQueries(REDUCER_KEY, action),
    ...(ROUTE_DATASET_MAPPER[action.type]) ? { dataset: ROUTE_DATASET_MAPPER[action.type] } : {}
  };

  switch (action.type) {
    case routing.home.type:
    case FETCH_MAP_DETAIL_SUCCESS:
    case SET_SELECTION: {
      return {
        ...initialState
      };
    }

    case FETCH_MARKERS_REQUEST:
      return {
        ...enrichedState,
        loadingMarkers: true
      };

    case FETCH_DATA_SELECTION_REQUEST:
      return {
        ...enrichedState,
        isLoading: true,
        markers: []
      };

    case FETCH_DATA_SELECTION_SUCCESS: {
      return {
        ...enrichedState,
        isLoading: false,
        markers: [],
        errorMessage: '',
        authError: false,
        ...action.payload
      };
    }

    case FETCH_DATA_SELECTION_FAILURE:
      return {
        ...enrichedState,
        isLoading: false,
        authError: (action.payload.error === 'Unauthorized'),
        errorMessage: action.payload.error,
        dataset: action.payload.dataset,
        result: {},
        markers: []
      };

    case FETCH_MARKERS_FAILURE:
      return {
        ...initialState,
        errorMessage: action.payload
      };

    case FETCH_MARKERS_SUCCESS:
      return {
        ...enrichedState,
        loadingMarkers: false,
        markers: action.payload
      };

    case SET_DATASET:
      return {
        ...enrichedState,
        dataset: action.payload
      };

    case SET_GEOMETRY_FILTER: {
      const { markers, distanceTxt, areaTxt } = action.payload;
      return {
        ...enrichedState,
        geometryFilter: {
          markers,
          description: `${distanceTxt} en ${areaTxt}`
        }
      };
    }

    case REMOVE_GEOMETRY_FILTER:
      return {
        ...enrichedState,
        geometryFilter: {}
      };

    case SET_PAGE:
      return {
        ...enrichedState,
        page: action.payload
      };

    case RESET_DATA_SELECTION:
      return {
        ...enrichedState,
        shape: ''
      };

    default:
      return enrichedState;
  }
}
