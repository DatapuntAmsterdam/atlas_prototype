import { combineReducers } from 'redux'
import { createSelector } from 'reselect'
import dataReducer, { DATA } from './data/data'
import apiSpecificationReducer, { API_SPECIFICATION } from './apiSpecification/apiSpecification'

const REDUCER_KEY = 'datasets'

export { REDUCER_KEY as DATASETS }

export default combineReducers({
  [DATA]: dataReducer,
  [API_SPECIFICATION]: apiSpecificationReducer,
})

// Selectors
export const getDatasetsData = state => state[REDUCER_KEY][DATA]
export const getApiSpecification = state => state[REDUCER_KEY][API_SPECIFICATION]

const getStateOfKey = {
  data: key => state =>
    createSelector(
      getDatasetsData,
      data => data[key],
    )(state),
  apiSpec: key => state =>
    createSelector(
      getApiSpecification,
      data => data[key],
    )(state),
}

export const getApiSpecificationData = getStateOfKey.apiSpec('data')

export const getResults = getStateOfKey.data('result')
export const getAuthError = getStateOfKey.data('authError')
export const getPage = getStateOfKey.data('page')
export const getSearchText = getStateOfKey.data('searchText')
export const getFilters = createSelector(
  getResults,
  result => result.filters || [],
)
export const getNumberOfResults = createSelector(
  getResults,
  result => result.numberOfRecords,
)
export const isLoading = createSelector(
  getDatasetsData,
  getApiSpecification,
  (result, apiSpecs) => result.isLoading || apiSpecs.isLoading,
)
