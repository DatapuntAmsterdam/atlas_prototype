import React from 'react';
import PropTypes from 'prop-types';

const MapDetailGebiedenUnesco = ({ panoUrl, unesco }) => (
  <section className="map-detail-result">
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
        <h1 className="map-detail-result__header-title">Unesco</h1>
        <h2 className="map-detail-result__header-subtitle">{unesco.label}</h2>
      </div>
    </header>
  </section>
);

MapDetailGebiedenUnesco.defaultProps = {
  panoUrl: ''
};

MapDetailGebiedenUnesco.propTypes = {
  unesco: PropTypes.shape({
    label: PropTypes.string.isRequired
  }).isRequired,
  panoUrl: PropTypes.string
};

export default MapDetailGebiedenUnesco;
