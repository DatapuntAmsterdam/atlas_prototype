import reducer, { addFilter, emptyFilters, removeFilter } from './filters';

describe('The filtersReducers', () => {
  it('EMPTY FILTERS saves the current filters', () => {
    const state = {
      filters: {
        myfilter: 'something'
      }
    };

    expect(reducer(state, emptyFilters())).toEqual({ filters: {} });
  });

  it('ADD_FILTER adds a filter to the current state', () => {
    const state = {
      myfilter: 'something'
    };

    const newFilter = { new_filter: 'foo' };
    expect(reducer(state, addFilter(newFilter))).toEqual({
      ...state,
      filters: {
        ...newFilter
      }
    });
  });

  it('REMOVE_FILTER removes a filter from the current state', () => {
    const state = {
      filters: {
        foo: 'bar',
        myfilter: 'something'
      }
    };

    expect(reducer(state, removeFilter('myfilter'))).toEqual({
      filters: {
        foo: 'bar'
      }
    });
  });
});
