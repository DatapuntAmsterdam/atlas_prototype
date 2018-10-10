import React from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import { AngularWrapper } from 'react-angular';

const mapStateToProps = (state) => ({
  endpoint: `https://acc.api.data.amsterdam.nl/dcatd/datasets/${state.catalog.detail}`, // TODO: refactor use API_ROOT and such
  reload: state.detail && state.detail.reload,
  isLoading: state.detail && state.detail.isLoading,
  skippedSearchResults: state.detail && state.detail.skippedSearchResults,
  catalogFilters: state.catalogFilters,
  user: state.user
});

const DetailContainer = ({
                           endpoint,
                           reload,
                           isLoading,
                           skippedSearchResults,
                           catalogFilters,
                           user
                         }) => (
                           <AngularWrapper
                             moduleName={'dpDetailWrapper'}
                             component="dpDetail"
                             dependencies={['atlas']}
                             bindings={{
                               reload,
                               isLoading,
                               skippedSearchResults,
                               catalogFilters,
                               user
                             }}
                             interpolateBindings={{
                               endpoint
                             }}
                           />
);

DetailContainer.defaultProps = {};

DetailContainer.propTypes = {
  endpoint: PropTypes.string.isRequired,
  reload: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  skippedSearchResults: PropTypes.bool.isRequired,
  catalogFilters: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  user: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
};

export default connect(mapStateToProps, null)(DetailContainer);
