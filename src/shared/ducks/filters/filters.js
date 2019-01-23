import { createSelector } from 'reselect';
import { getFilters as getDataSelectionFilters, getShapeFilter } from '../data-selection/selectors';
import { getFilters as getDatasetFilters } from '../datasets/datasets';
import paramsRegistry from '../../../store/params-registry';

export const REDUCER_KEY = 'filter';
export const EMPTY_FILTERS = `${REDUCER_KEY}/EMPTY_FILTERS`;

export const ADD_FILTER = `${REDUCER_KEY}/ADD_FILTER`;
export const REMOVE_FILTER = `${REDUCER_KEY}/REMOVE_FILTER`;

export const initialState = {
  filters: {}
};

const reducer = (state = initialState, action) => {
  const enrichedState = {
    ...state,
    ...paramsRegistry.getStateFromQueries(REDUCER_KEY, action)
  };
  switch (action.type) {
    case ADD_FILTER:
      return {
        ...enrichedState,
        filters: { ...enrichedState.filters, ...action.payload }
      };

    case REMOVE_FILTER: {
      const newState = { ...enrichedState };
      delete newState.filters[action.payload];
      return {
        ...newState
      };
    }

    case EMPTY_FILTERS:
      return initialState;

    default:
      return enrichedState;
  }
};

export const addFilter = (payload) => ({
  type: ADD_FILTER,
  payload,
  meta: {
    tracking: payload
  }
});

export const removeFilter = (payload) => ({
  type: REMOVE_FILTER,
  payload,
  meta: {
    tracking: payload
  }
});

export const emptyFilters = () => ({ type: EMPTY_FILTERS });

// Selectors
const getReducerState = (state) => state[REDUCER_KEY];
export const getFiltersWithoutShape = createSelector(getReducerState, ({ filters }) => filters);
export const getFilters = createSelector(
  getFiltersWithoutShape, getShapeFilter,
  (filters, shapeFilter) => ({
    ...filters,
    ...shapeFilter
  })
);

export const selectDataSelectionFilters = createSelector(
  getFilters, getDataSelectionFilters,
  (activeFilters, availableFilters) => {
    const formattedFilters = availableFilters
      .filter((filterSet) => activeFilters[filterSet.slug])
      .map((availableFilter) => {
        const value = activeFilters[availableFilter.slug];
        const filter = { ...availableFilter };
        // If there are no options but the filter is active, adding the filtered
        // value as an option with 0 values available
        if (filter.numberOfOptions === 0) {
          filter.options = [{
            id: value,
            label: value,
            count: 0
          }];
        }

        const option = filter.options.find((opt) => opt.id === value) ||
          (activeFilters.sbi_code && { label: activeFilters.sbi_code.replace(/['[\]]/g, '') });

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
  getFilters, getDatasetFilters,
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
