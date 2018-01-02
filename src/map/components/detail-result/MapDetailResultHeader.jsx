import React from 'react';
import PropTypes from 'prop-types';

const MapDetailResultHeader = ({ panoUrl, title, subtitle }) => {
  return (
    <header
      className={`
        map-detail-result__header
        map-detail-result__header--${panoUrl ? 'pano' : 'no-pano'}
      `}
    >
      {panoUrl && (
        <img
          alt="Panoramabeeld"
          className="map-detail-result__header-pano"
          src={panoUrl}
        />
      )}
      <div className="map-detail-result__header-container">
        <h1 className="map-detail-result__header-title">{ title }</h1>
        <h2 className="map-detail-result__header-subtitle">{ subtitle }</h2>
      </div>
    </header>
  );
};

MapDetailResultHeader.propTypes = {
  panoUrl: PropTypes.string,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired
};

export default MapDetailResultHeader;
