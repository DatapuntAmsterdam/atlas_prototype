import React from 'react';
import PropTypes from 'prop-types';
import { AngularWrapper } from 'react-angular';

const DatasetDetail = ({
  isLoading,
  catalogFilters,
  user,
  endpoint,
  detailTemplateUrl,
  detailData
}) => (
  <div className="c-dashboard__content qa-detail">
    <AngularWrapper
      moduleName={'dpDetailWrapper'}
      component="dpDetail"
      dependencies={['atlas']}
      bindings={{
        isLoading,
        catalogFilters,
        user,
        detailTemplateUrl,
        detailData
      }}
      interpolateBindings={{
        endpoint
      }}
    />
  </div>
);

DatasetDetail.defaultProps = {
  isLoading: false,
  detailTemplateUrl: undefined,
  detailData: undefined
};

DatasetDetail.propTypes = {
  isLoading: PropTypes.bool,
  catalogFilters: PropTypes.shape({}).isRequired,
  user: PropTypes.shape({}).isRequired,
  endpoint: PropTypes.string.isRequired,
  detailTemplateUrl: PropTypes.string,
  detailData: PropTypes.shape({})
};

export default DatasetDetail;
