import React from 'react';
import PropTypes from 'prop-types';

const MapDetailPand = ({ panoUrl, pand }) => (
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
        <h1 className="map-detail-result__header-title">Pand</h1>
        <h2 className="map-detail-result__header-subtitle">{pand._display}</h2>
      </div>
    </header>
  </section>
);

MapDetailPand.defaultProps = {
  panoUrl: ''
};

MapDetailPand.propTypes = {
  pand: PropTypes.shape({
    label: PropTypes.string
  }).isRequired,
  panoUrl: PropTypes.string
};

export default MapDetailPand;
