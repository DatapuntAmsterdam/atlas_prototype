import { createSelector } from 'reselect';
import {
  getDetailDisplay,
  getDetailEndpoint,
  getDetailGeometry
} from '../../../shared/ducks/detail/selectors';
import { isDataDetailPage, isPanoPage } from '../../../store/redux-first-router/selectors';
import {
  FETCH_MAP_DETAIL_FAILURE,
  FETCH_MAP_DETAIL_REQUEST,
  FETCH_MAP_DETAIL_SUCCESS
} from './constants';

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

export const getDetailId = createSelector(getDetailEndpoint, getCurrentEndpoint,
  (detailEndpoint, currentEndpoint) => detailEndpoint || currentEndpoint);

export const getGeometry = createSelector(
  getDetailGeometry,
  (detailGeometry) => detailGeometry
);

export const shouldShowGeoJson = () => isDataDetailPage || isPanoPage;

export const getGeoJson = createSelector(
  shouldShowGeoJson,
  getGeometry,
  getDetailDisplay,
  getDetailId,
  (isGeoJsonActive, geometry, detailDisplay, detailId) => (
    (isGeoJsonActive && geometry) ? {
      id: detailId,
      geoJson: {
        geometry: geometry || '',
        label: detailDisplay || ''
      }
    } : {}
  ));

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
        currentEndpoint: action.payload,
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

export const getMapDetail = (payload) => ({
  type: FETCH_MAP_DETAIL_REQUEST,
  payload
});
export const fetchMapDetailFailure = (error) => ({ type: FETCH_MAP_DETAIL_FAILURE, error });
export const fetchMapDetailSuccess = (endpoint, mapDetail) => ({
  type: FETCH_MAP_DETAIL_SUCCESS,
  endpoint,
  mapDetail
});
