import React from 'react';
import { AngularWrapper } from 'react-angular';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import LoadingIndicator from '../../shared/components/loading-indicator/LoadingIndicator';
import { DEFAULT_DATASET, DEFAULT_VIEW } from '../../shared/ducks/datasets/data/data';
import {
  getAuthError,
  getResults,
  isLoading as datasetsLoading
} from '../../shared/ducks/datasets/datasets';
import { getActiveFilters } from '../../shared/ducks/filters/filters';
import { getUser } from '../../shared/ducks/user/user';
import Dataset from '../components/Dataset';

const DatasetPage = ({
  activeFilters,
  results: {
    numberOfRecords,
    filters: availableFilters
  },
  isLoading,
  user,
  authError
}) => {
  if (isLoading || (!numberOfRecords && !authError)) {
    return <LoadingIndicator />;
  }
  return (
    <div className="c-data-selection c-dashboard__content">
      {!isLoading && numberOfRecords && (
        <div className="qa-data-selection-content">
          <AngularWrapper
            moduleName={'dpDataSelectionHeaderWrapper'}
            component="dpDataSelectionHeader"
            dependencies={['atlas']}
            bindings={{
              dataset: DEFAULT_DATASET,
              availableFilters,
              filters: activeFilters,
              numberOfRecords,
              showHeader: true,
              user,
              view: DEFAULT_VIEW
            }}
          />

          <Dataset />
        </div>
      )}
    </div>
  );
};

DatasetPage.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  activeFilters: PropTypes.shape({}).isRequired,
  authError: PropTypes.bool.isRequired,
  user: PropTypes.shape({}).isRequired,
  results: PropTypes.shape({
    numberOfRecords: PropTypes.number,
    filters: PropTypes.arrayOf(PropTypes.object)
  }).isRequired
};

const mapStateToProps = (state) => ({
  isLoading: datasetsLoading(state),
  authError: getAuthError(state),
  activeFilters: getActiveFilters(state),
  results: getResults(state),
  user: getUser(state)
});

export default connect(mapStateToProps, null)(DatasetPage);
