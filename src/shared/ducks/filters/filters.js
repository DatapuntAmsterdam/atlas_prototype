import ACTIONS from '../../actions';

/*
    TODO:
    move all the logic from
    src/reducers/deprecated/filters-reducers.js
    to here
 */

const emptyFilters = () =>
  ({
    type: ACTIONS.EMPTY_FILTERS
  });

export default emptyFilters;
