import { createSelector } from 'reselect';

import { isSearchActive } from '../search-results/map-search-results';
import { getDataSelection } from '../data-selection/data-selection';

export const detailSelector = (state) => state.detail;
const mapDetailSelector = (state) => state.mapDetail;

export const getCurrentEndpoint = createSelector(mapDetailSelector,
  (mapDetail) => mapDetail.currentEndpoint);

export const getAllResults = createSelector(mapDetailSelector,
  (mapDetail) => mapDetail.byEndpoint);

export const selectLatestMapDetail = createSelector([getCurrentEndpoint, getAllResults],
  (currentEndpoint, byEndpoint) => (
    currentEndpoint && byEndpoint && byEndpoint[currentEndpoint]
  ));

export const getMapDetailGeometry = createSelector(selectLatestMapDetail,
  (activeMapDetail) => (
     activeMapDetail && activeMapDetail.geometrie
  ));

export const getDetailId = createSelector(detailSelector, getCurrentEndpoint,
  (detail, currentEndpoint) => (detail && detail.endpoint) || currentEndpoint);

export const getGeometry = createSelector([detailSelector, getMapDetailGeometry],
  (detail, mapDetailGeometry) => (
    detail && detail.geometry ? detail.geometry : mapDetailGeometry
  ));

export const shouldShowGeoJson = createSelector([detailSelector, isSearchActive, getDataSelection],
  (detailActive, searchActive, dataSelectionActive) => (
    Boolean(detailActive && !searchActive && !dataSelectionActive)
  ));

export const getGeoJson = createSelector(
  [shouldShowGeoJson, getGeometry, detailSelector, getDetailId],
  (isGeoJsonActive, geometry, detail, detailId) => (
    (isGeoJsonActive && geometry) ? {
      id: detailId,
      geoJson: {
        geometry,
        label: detail && detail.display ? detail.display : ''
      }
    } : {}
  ));

export const FETCH_MAP_DETAIL_REQUEST = 'FETCH_MAP_DETAIL_REQUEST';
export const FETCH_MAP_DETAIL_SUCCESS = 'FETCH_MAP_DETAIL_SUCCESS';
export const FETCH_MAP_DETAIL_FAILURE = 'FETCH_MAP_DETAIL_FAILURE';

const initialState = {
  byEndpoint: {},
  isLoading: false,
  currentEndpoint: '',
  error: ''
};

export default function MapDetailReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_MAP_DETAIL_REQUEST:
      return {
        ...state,
        currentEndpoint: action.endpoint,
        isLoading: true
      };

    case FETCH_MAP_DETAIL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        byEndpoint: {
          ...state.byEndpoint,
          [action.endpoint]: action.mapDetail
        }
      };

    case FETCH_MAP_DETAIL_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error
      };

    default:
      return state;
  }
}

export const getMapDetail = (endpoint, user) => ({
  type: FETCH_MAP_DETAIL_REQUEST,
  endpoint,
  user
});
export const fetchMapDetailFailure = (error) => ({ type: FETCH_MAP_DETAIL_FAILURE, error });
export const fetchMapDetailSuccess = (endpoint, mapDetail) => ({
  type: FETCH_MAP_DETAIL_SUCCESS,
  endpoint,
  mapDetail
});
