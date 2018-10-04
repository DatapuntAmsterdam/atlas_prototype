import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import MapContainer from '../../map/containers/map/MapContainer';

const Map = ({ columnSizes }) => {
  const classes = classNames({ 'u-page-break-after': columnSizes.middle && columnSizes.right });
  return (
    <div style={{ height: '100%' }}>
      <div
        className={`c-dashboard__column u-col-sm--${columnSizes.middle} qa-dashboard__column--middle ${classes}`}
      >
        <div className="qa-map">
          <MapContainer />
        </div>
      </div>
      <div
        style={{ display: (columnSizes.right) ? 'block' : 'none' }}
        className={`c-dashboard__column c-dashboard__content u-col-sm--${columnSizes.right} qa-dashboard__column--right`}
      />
    </div>
  );
};

Map.defaultProps = {
  columnSizes: { // determineColumnSizes in dashboard-columns
    right: 4,
    middle: 12
  }
};

Map.propTypes = {
  columnSizes: PropTypes.shape({
    right: PropTypes.number,
    middle: PropTypes.number
  })
};

export default Map;
