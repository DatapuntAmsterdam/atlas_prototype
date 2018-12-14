import { createSelector } from 'reselect';
import { ROUTER_NAMESPACE, routing } from '../../../app/routes';
import { PANORAMA_CONFIG } from '../../services/panorama-api/panorama-api';
import PANORAMA_VIEW from './panorama-view';
import {
  panoramaOrientationType,
  panoramaPersonType
} from '../../../map/components/leaflet/services/icons.constant';
import PAGES from '../../../app/pages';

export const REDUCER_KEY = 'panorama';

export const FETCH_PANORAMA_REQUEST = `${REDUCER_KEY}/FETCH_PANORAMA_REQUEST`;
export const FETCH_PANORAMA_SUCCESS = `${REDUCER_KEY}/FETCH_PANORAMA_SUCCESS`;
export const FETCH_PANORAMA_ERROR = `${REDUCER_KEY}/FETCH_PANORAMA_ERROR`;
export const SET_PANORAMA_ORIENTATION = `${REDUCER_KEY}/SET_PANORAMA_ORIENTATION`;
export const SET_PANORAMA_YEAR = `${REDUCER_KEY}/SET_PANORAMA_YEAR`;
export const CLOSE_PANORAMA = `${REDUCER_KEY}/CLOSE_PANORAMA`;

export const initialState = {
  location: null,   // eg: [52.8, 4.9]
  year: undefined,  // eg: 2016
  pitch: 0,         // eg: -10
  heading: 0,       // eg: 270
  fov: null,        // eg: 65
  image: null,      // eg: {
                    //     pattern: 'http://www.example.com/path/some-id/{this}/{that}/{thingie}.jpg',
                    //     preview: 'http://www.example.com/path/some-id/preview.jpg'
                    // }
  hotspots: [],     // eg: [{id: 'ABC124', heading: 90, distance: 18}],
  date: null,       // eg: new Date()
  isLoading: true
};

export default function reducer(state = initialState, action) {
  if (action.type &&
    action.type.startsWith(ROUTER_NAMESPACE) &&
    !action.type.includes(PAGES.PANORAMA)
  ) {
    return initialState;
  }
  switch (action.type) {
    case routing.panorama.type: {
      const { query = {} } = action.meta;
      let view;
      if (Object.prototype.hasOwnProperty.call(query, 'kaart')) {
        view = PANORAMA_VIEW.MAP;
      } else if (Object.prototype.hasOwnProperty.call(query, 'panorama')) {
        view = PANORAMA_VIEW.PANO;
      } else {
        view = PANORAMA_VIEW.MAP_PANO;
      }
      return {
        ...state,
        view,
        id: action.payload.id,
        heading: query.heading || state.heading,
        pitch: query.pitch || state.pitch
      };
    }

    case FETCH_PANORAMA_REQUEST:
      return {
        ...state,
        id: action.payload.id,
        isLoading: true
      };

    case SET_PANORAMA_YEAR:
      return {
        ...state,
        year: action.payload
      };

    case FETCH_PANORAMA_SUCCESS:
      return {
        ...state,
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
        ...state,
        isLoading: false,
        isError: true // TODO: refactor, show error
      };

    case SET_PANORAMA_ORIENTATION:
      return {
        ...state,
        heading: action.payload.heading,
        pitch: action.payload.pitch,
        fov: action.payload.fov
      };

    case CLOSE_PANORAMA:
      return {
        ...state,
        location: initialState.location,
        image: initialState.image
      };

    default:
      return state;
  }
}

// Actions creators
export const fetchPanoramaRequest = (id) => ({
  type: FETCH_PANORAMA_REQUEST,
  payload: {
    id
  }
});

export const fetchPanoramaSuccess = (payload) => ({
  type: FETCH_PANORAMA_SUCCESS,
  payload
});

export const fetchPanoramaError = (error) => ({
  type: FETCH_PANORAMA_ERROR,
  payload: error
});

export const setPanoramaYear = (year) => ({
  type: SET_PANORAMA_YEAR,
  payload: year
});

export const setPanoramaOrientation = ({ heading, pitch, fov }) => ({
  type: SET_PANORAMA_ORIENTATION,
  payload: {
    heading,
    pitch,
    fov
  }
});

export const closePanorama = () => ({ type: CLOSE_PANORAMA });

// Selectors
/**
 * @deprecated Don't use getPanorama outside reducer,
 * use specific selector. e.g.: getPanoramaHeading()
 */
export const getPanorama = (state) => state[REDUCER_KEY] || {};
export const getHotspots = createSelector(getPanorama, (panorama) => {
  const { year, hotspots } = panorama;
  if (year) {
    // TODO: refactor: refire hotspots search request. Not everything is returned from back-end.
    // TODO: refactor: test hotspots are filtered by year
    return hotspots.filter((hotspot) => hotspot.year === year);
  }
  return hotspots;
});

export const getPanoramaLocation = createSelector(
  getPanorama,
  (panorama) => (
    panorama ? panorama.location : ''
  )
);
export const getPanoramaId = createSelector(getPanorama, (panorama) => panorama.id);
export const getPanoramaHeading = createSelector(getPanorama,
  (panorama) => panorama.heading
);
export const getPanoramaPitch = createSelector(getPanorama,
  (panorama) => panorama.pitch
);
export const getPanoramaMarkers = createSelector([getPanoramaLocation, getPanoramaHeading],
  (location, heading) => (
    location ? [
      {
        position: location,
        type: panoramaOrientationType,
        heading: heading || 0
      },
      {
        position: location,
        type: panoramaPersonType
      }
    ] : []
  )
);

export const getPanoramaView = createSelector(getPanorama, (panorama) => panorama.view);
export const getPanoramaYear = createSelector(getPanorama, (panorama) => panorama.year);
