import React from 'react';
import PropTypes from 'prop-types';

const MapDetailGebiedenBuurt = ({ panoUrl, buurt }) => (
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
        <h1 className="map-detail-result__header-title">Buurt</h1>
        <h2 className="map-detail-result__header-subtitle">{buurt.label}</h2>
      </div>
    </header>
  </section>
);

MapDetailGebiedenBuurt.defaultProps = {
  panoUrl: ''
};

MapDetailGebiedenBuurt.propTypes = {
  buurt: PropTypes.shape({
    label: PropTypes.string.isRequired
  }).isRequired,
  panoUrl: PropTypes.string
};

export default MapDetailGebiedenBuurt;
