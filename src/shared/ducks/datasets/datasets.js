import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import results, { REDUCER_KEY as DATA } from './data/data';
import filters, { REDUCER_KEY as API_SPECIFICATION } from './apiSpecification/apiSpecification';

export const REDUCER_KEY = 'datasets';

export default combineReducers({
  [DATA]: results,
  [API_SPECIFICATION]: filters
});

// Selectors
const getDatasetsData = (state) => state[REDUCER_KEY][DATA];
const getApiSpecification = (state) => state[REDUCER_KEY][API_SPECIFICATION];

const getStateOfKey = {
  data: (key) => (state) => createSelector(getDatasetsData, (data) => (data[key]))(state),
  apiSpec: (key) => (state) => createSelector(getApiSpecification, (data) => (data[key]))(state)
};

export const getApiSpecificationData = getStateOfKey.apiSpec('data');

export const getResults = getStateOfKey.data('result');
export const getAuthError = getStateOfKey.data('authError');
export const getPage = getStateOfKey.data('page');
export const getFilters = createSelector(getResults, (result) => result.filters || []);
export const getNumberOfResults = createSelector(
  getResults,
  (resultState) => resultState.numberOfRecords
);
export const isLoading = createSelector(
  getDatasetsData,
  getApiSpecification,
  (resultState, apiSpecs) => resultState.isLoading || apiSpecs.isLoading
);
