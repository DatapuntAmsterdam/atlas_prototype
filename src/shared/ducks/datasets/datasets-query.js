import { FETCH_DATASETS_SUCCESS, initialState, SET_PAGE } from './data/data';
import { getPage } from './datasets';
import { EMPTY_FILTERS } from '../filters/filters';

export default {
  page: {
    selector: getPage,
    defaultValue: initialState.page
  }
};

export const ACTIONS = [
  SET_PAGE,
  FETCH_DATASETS_SUCCESS,
  EMPTY_FILTERS
];
