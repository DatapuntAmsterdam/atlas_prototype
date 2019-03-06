import {
  FETCH_MAP_DETAIL_REQUEST,
  FETCH_MAP_DETAIL_SUCCESS,
  FETCH_MAP_DETAIL_FAILURE
} from './constants';

export const getMapDetail = (payload) => ({
  type: FETCH_MAP_DETAIL_REQUEST,
  payload
});

export const fetchMapDetailFailure = (error) => ({
  type: FETCH_MAP_DETAIL_FAILURE,
  error
});

export const fetchMapDetailSuccess = (endpoint, mapDetail) => ({
  type: FETCH_MAP_DETAIL_SUCCESS,
  endpoint,
  mapDetail
});
