import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import MapContainer from '../../map/containers/map/MapContainer';
import Panorama from '../containers/PanoramaContainer';

const Map = ({ columnSizes, showPanorama }) => {
  const sizeMap = showPanorama ? 4 : 12;
  const sizePanorama = 12 - sizeMap;
  const classes = classNames({ 'u-page-break-after': columnSizes.middle && columnSizes.right });

  return (
    <div style={{ height: '100%' }}>
      <div
        className={`c-dashboard__column u-col-sm--${sizeMap} qa-dashboard__column--middle ${classes}`}
      >
        <div className="qa-map">
          <MapContainer />
        </div>
      </div>
      {showPanorama && (
        <div
          style={{ display: (showPanorama) ? 'block' : 'none' }}
          className={`c-dashboard__column c-dashboard__content u-col-sm--${sizePanorama} qa-dashboard__column--right`}
        >
          <Panorama />
        </div>
      )}
    </div>
  );
};

Map.defaultProps = {
  showPanorama: false,
  columnSizes: { // determineColumnSizes in dashboard-columns
    right: 4,
    middle: 12
  }
};

Map.propTypes = {
  showPanorama: PropTypes.bool,
  columnSizes: PropTypes.shape({
    right: PropTypes.number,
    middle: PropTypes.number
  })
};

export default Map;
