import React from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import { AngularWrapper } from 'react-angular';

const mapStateToProps = (state) => ({
  boundingBox: state.map.boundingBox,
  catalogFilters: state.catalogFilters,
  dataSelectionState: state.dataSelection,
  filters: state.filters,
  zoomLevel: state.map.zoom,
  user: state.user
});

const DataSelection = ({
  columnSizes,
  boundingBox,
  catalogFilters,
  filters,
  dataSelectionState,
  user,
  zoomLevel,
  view,
  dataset
}) => (
  <div
    style={{ display: (columnSizes.right) ? 'block' : 'none' }}
    className={`c-dashboard__column c-dashboard__content u-col-sm--${columnSizes.right} qa-dashboard__column--right`}
  >
    <div className="qa-data-selection">
      <AngularWrapper
        moduleName="dpDataSelectionWrapper"
        component={'dpDataSelection'}
        dependencies={['atlas']}
        bindings={{
          boundingBox,
          catalogFilters,
          filters,
          state: dataSelectionState,
          user,
          zoomLevel,
          view,
          dataset
        }}
      />
    </div>
  </div>
);

DataSelection.defaultProps = {
  boundingBox: undefined,
  zoomLevel: undefined
};

DataSelection.propTypes = {
  boundingBox: PropTypes.arrayOf(PropTypes.number),
  catalogFilters: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  filters: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  user: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  dataSelectionState: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  zoomLevel: PropTypes.number,
  columnSizes: PropTypes.shape({
    right: PropTypes.number,
    middle: PropTypes.number
  }).isRequired,
  view: PropTypes.string.isRequired,
  dataset: PropTypes.string.isRequired
};

export default connect(mapStateToProps, null)(DataSelection);
