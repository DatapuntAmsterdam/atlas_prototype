export const REDUCER_KEY = 'detail';
export const FETCH_DETAIL = 'FETCH_DETAIL';
export const SHOW_DETAIL = 'SHOW_DETAIL';
export const SET_VIEW = 'SET_VIEW';
export const DETAIL_VIEW = {
  MAP: 'map',
  MAP_DETAIL: 'MAP_DETAIL',
  DETAIL: 'detail'
};
export const initialState = {
  view: DETAIL_VIEW.MAP_DETAIL,
  isLoading: false
};
