import { createSelector } from 'reselect';
import { REDUCER_KEY } from './constants';

export const getDataSearch = (state) => state[REDUCER_KEY];
const getStateOfKey = (key) =>
  (state) => createSelector(getDataSearch, (data) => (data[key]))(state);

// Data to search for
export const getDataSearchLocation = getStateOfKey('geoSearch');
export const isSearchLoading = getStateOfKey('isLoading');
export const getSearchQuery = getStateOfKey('query');
export const getSearchCategory = getStateOfKey('category');

// Results
export const getSearchQueryResults = getStateOfKey('resultsQuery');
export const getMapPanelResults = getStateOfKey('resultsMapPanel');
export const getMapListResults = getStateOfKey('resultsMap');

// Misc
export const getDataSearchError = getStateOfKey('error');
export const getNumberOfResults = getStateOfKey('numberOfResults');
