import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { AngularWrapper } from 'react-angular';
import { isDetailLoading } from '../../shared/ducks/detail/selectors';
import { getUser } from '../../shared/ducks/user/user';
import { getApiSpecificationData } from '../../shared/ducks/datasets/datasets';
import { getLocationPayload } from '../../store/redux-first-router';

const mapStateToProps = (state) => ({
  isLoading: isDetailLoading(state),
  catalogFilters: getApiSpecificationData(state),
  user: getUser(state),
  endpoint: `https://acc.api.data.amsterdam.nl/dcatd/datasets/${getLocationPayload(state).id}` // TODO: refactor use API_ROOT and such
});

const DatasetDetailContainer = ({
  isLoading,
  catalogFilters,
  user,
  endpoint
}) => (
  <div className="c-dashboard__content qa-detail">
    <AngularWrapper
      moduleName={'dpDetailWrapper'}
      component="dpDetail"
      dependencies={['atlas']}
      bindings={{
        isLoading,
        catalogFilters,
        user
      }}
      interpolateBindings={{
        endpoint
      }}
    />
  </div>
);

DatasetDetailContainer.defaultProps = {
  isLoading: false
};

DatasetDetailContainer.propTypes = {
  isLoading: PropTypes.bool,
  catalogFilters: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  user: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  endpoint: PropTypes.string.isRequired
};

export default connect(mapStateToProps, null)(DatasetDetailContainer);
