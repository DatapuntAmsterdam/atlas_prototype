import { FETCH_DETAIL, SET_VIEW, SHOW_DETAIL } from './constants';

export const fetchDetail = (payload) => ({
  type: FETCH_DETAIL,
  payload
});

export const showDetail = (payload) => ({
  type: SHOW_DETAIL,
  payload
});

export const setView = (payload) => ({
  type: SET_VIEW,
  payload
});
