import {
  FETCH_DATA_SELECTION_SUCCESS,
  initialState,
  RESET_DATA_SELECTION,
  SET_GEOMETRY_FILTERS,
  SET_PAGE,
  SET_VIEW
} from './constants';
import { getDataSelectionPage, getGeometryFilters, getDataSelectionView } from './selectors';

const getEncodedGeometryFilters = (state) => {
  const { markers, description } = getGeometryFilters(state);
  if (markers && description) {
    return btoa(JSON.stringify({
      markers: markers.map((latLong) => `${latLong[0]}:${latLong[1]}`).join('|'),
      description
    }));
  }
  return undefined;
};

const getDecodedGeometryFilters = (geo) => {
  let geometryFilter = initialState.geometryFilter;
  if (geo) {
    const { markers, description } = JSON.parse(atob(geo));
    geometryFilter = {
      markers: markers && markers.length
        ? markers.split('|').map((latLng) => latLng.split(':').map((str) => parseFloat(str)))
        : [],
      description
    };
  }

  return geometryFilter;
};

export default {
  dsPage: {
    stateKey: 'page',
    selector: getDataSelectionPage,
    decode: (val) => val,
    defaultValue: initialState.page
  },
  geo: {
    stateKey: 'geometryFilter',
    selector: getEncodedGeometryFilters,
    decode: getDecodedGeometryFilters
  },
  view: {
    stateKey: 'view',
    selector: getDataSelectionView,
    decode: (val) => val,
    defaultValue: initialState.view
  }
};

export const ACTIONS = [
  SET_PAGE,
  SET_GEOMETRY_FILTERS,
  RESET_DATA_SELECTION,
  FETCH_DATA_SELECTION_SUCCESS,
  SET_VIEW
];
