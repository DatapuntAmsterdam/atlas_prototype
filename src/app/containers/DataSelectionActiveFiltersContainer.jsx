import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { removeGeometryFilter } from '../../shared/ducks/data-selection/actions';
import { removeFilter as removeActiveFilter, selectDataSelectionFilters } from '../../shared/ducks/filters/filters';
import ActiveFilters from '../components/ActiveFilters/ActiveFilters';

const DataSelectionActiveFilters = ({ filters, removeFilter }) => (
  <ActiveFilters filters={filters} removeFilter={removeFilter} />
);

DataSelectionActiveFilters.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.object).isRequired,
  removeFilter: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  filters: selectDataSelectionFilters(state)
});

const mapDispatchToProps = (dispatch) => ({
  removeFilter: (key) => (
    (key === 'shape') ?
      dispatch(removeGeometryFilter()) :
      dispatch(removeActiveFilter(key))
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(DataSelectionActiveFilters);
