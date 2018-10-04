import ACTIONS from '../../shared/actions';
import filtersReducers from './filters-reducers';

describe('The filtersReducers', () => {
  const state = {
    foo: 'bar',
    filters: {}
  };

  it('APPLY FILTERS saves the current filters', () => {
    const payload = {
      filter: 'this'
    };
    const output = filtersReducers[ACTIONS.APPLY_FILTERS](state, payload);

    expect(output)
      .toEqual({
        ...state,
        filters: payload
      });
  });

  it('EMPTY FILTERS saves the current filters', () => {
    const filterState = {
      ...state,
      filters: {
        myfilter: 'something'
      }
    };
    const output = filtersReducers[ACTIONS.EMPTY_FILTERS](filterState);
    expect(output)
      .toEqual(state);
  });
});
