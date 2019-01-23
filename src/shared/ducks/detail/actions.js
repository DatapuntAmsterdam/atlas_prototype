import { FETCH_DETAIL, SHOW_DETAIL } from './constants';

export const fetchDetail = (payload) => ({
  type: FETCH_DETAIL,
  payload
});

export const showDetail = (payload) => ({
  type: SHOW_DETAIL,
  payload
});
