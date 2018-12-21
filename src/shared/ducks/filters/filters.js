import { createSelector } from 'reselect';
import { routing } from '../../../app/routes';
import { getFilters as getDataSelectionFilters } from '../data-selection/selectors';
import { getFilters as getDatasetFilters } from '../datasets/datasets';

export const REDUCER_KEY = 'filters';
export const EMPTY_FILTERS = `${REDUCER_KEY}/EMPTY_FILTERS`;

export const ADD_FILTER = `${REDUCER_KEY}/ADD_FILTER`;
export const REMOVE_FILTER = `${REDUCER_KEY}/REMOVE_FILTER`;
export const SET_SHAPE_FILTER = `${REDUCER_KEY}/SET_SHAPE_FILTER`;

const reducer = (state = {}, action) => {
  switch (action.type) {
    case routing.datasets.type:
    case routing.addresses.type:
    case routing.establishments.type:
    case routing.cadastralObjects.type: {
      const { filters: queryFilters } = action.meta.query || {};
      let filterToParse = '{}';
      if (queryFilters) {
        filterToParse = atob(queryFilters);
      }

      return Object.assign({}, JSON.parse(filterToParse));
    }

    case ADD_FILTER:
      return {
        ...state,
        ...action.payload
      };

    case REMOVE_FILTER: {
      const newState = { ...state };
      delete newState[action.payload];
      return {
        ...newState
      };
    }

    case SET_SHAPE_FILTER:
      return {
        ...state,
        shape: { ...action.payload }
      };

    case EMPTY_FILTERS:
      return {};
    default:
      return state;
  }
};

export const getFilters = (state) => state[REDUCER_KEY];

export const addFilter = (payload) => ({
  type: ADD_FILTER,
  payload
});

export const removeFilter = (filterKey) => ({
  type: REMOVE_FILTER,
  payload: filterKey
});

export const setShapeFilter = (payload) => ({ type: SET_SHAPE_FILTER, payload });
export const emptyFilters = () => ({ type: EMPTY_FILTERS });

// Selectors
export const getActiveFilters = (state) => state[REDUCER_KEY];
export const selectDataSelectionFilters = createSelector(
  getActiveFilters, getDataSelectionFilters,
  (activeFilters, availableFilters) => {
    const formattedFilters = availableFilters
      .filter((filterSet) => activeFilters[filterSet.slug])
      .map((availableFilter) => {
        const value = activeFilters[availableFilter.slug];
        const { id, label } = value;
        const filter = { ...availableFilter };
        // If there are no options but the filter is active, adding the filtered
        // value as an option with 0 values available
        if (filter.numberOfOptions === 0) {
          filter.options = [{
            id,
            label,
            count: 0
          }];
        }

        const option = filter.options.find((opt) => opt.id === value);
        return {
          slug: filter.slug,
          label: filter.label,
          option: option && option.label
        };
      });
    if (activeFilters.shape) {
      formattedFilters.push(activeFilters.shape);
    }
    return formattedFilters;
  });

export const selectDatasetFilters = createSelector(
  getActiveFilters, getDatasetFilters,
  (activeFilters, availableFilters) => {
    const formattedFilters = availableFilters
      .filter((filterSet) => activeFilters[filterSet.slug])
      .map((availableFilter) => {
        const value = activeFilters[availableFilter.slug];
        const { id, label } = value;
        const filter = { ...availableFilter };
        // If there are no options but the filter is active, adding the filtered
        // value as an option with 0 values available
        if (filter.numberOfOptions === 0) {
          filter.options = [{
            id,
            label,
            count: 0
          }];
        }

        const option = filter.options.find((opt) => opt.id === value);
        return {
          slug: filter.slug,
          label: filter.label,
          option: option && option.label
        };
      });
    if (activeFilters.shape) {
      formattedFilters.push(activeFilters.shape);
    }
    return formattedFilters;
  });

export default reducer;
