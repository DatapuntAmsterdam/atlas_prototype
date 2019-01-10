import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { removeGeometryFilter } from '../../shared/ducks/data-selection/actions';
import {
  removeFilter as removeActiveFilter,
  selectDatasetFilters
} from '../../shared/ducks/filters/filters';
import ActiveFilters from '../components/ActiveFilters/ActiveFilters';

const DatasetActiveFilters = ({ filters, removeFilter }) => (
  <ActiveFilters filters={filters} removeFilter={removeFilter} />
);

DatasetActiveFilters.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.object).isRequired,
  removeFilter: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  filters: selectDatasetFilters(state)
});

const mapDispatchToProps = (dispatch) => ({
  removeFilter: (key) => (
    (key === 'shape') ?
      dispatch(removeGeometryFilter()) :
      dispatch(removeActiveFilter(key))
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(DatasetActiveFilters);
