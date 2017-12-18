import React from 'react';
import PropTypes from 'prop-types';

const MapDetailBouwblok = ({ panoUrl, bouwblok }) => (
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
        <h1 className="map-detail-result__header-title">Bouwblok</h1>
        <h2 className="map-detail-result__header-subtitle">{bouwblok._display}</h2>
      </div>
    </header>
  </section>
);

MapDetailBouwblok.defaultProps = {
  panoUrl: ''
};

MapDetailBouwblok.propTypes = {
  bouwblok: PropTypes.shape({
    _display: PropTypes.string.isRequired
  }).isRequired,
  panoUrl: PropTypes.string
};

export default MapDetailBouwblok;
