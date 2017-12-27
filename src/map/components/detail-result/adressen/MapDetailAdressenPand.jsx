import React from 'react';
import PropTypes from 'prop-types';

import MapDetailResultItem from '../MapDetailResultItem';

const MapDetailAdressenPand = ({ panoUrl, pand }) => (
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
        <h2 className="map-detail-result__header-subtitle">{pand.label}</h2>
      </div>
    </header>
    <ul className="map-detail-result__list">
      <MapDetailResultItem
        label="Oorspronkelijk bouwjaar"
        value={pand.year}
      />
      <MapDetailResultItem
        label="Status"
        value={pand.status}
      />
    </ul>
  </section>
);

MapDetailAdressenPand.defaultProps = {
  panoUrl: ''
};

MapDetailAdressenPand.propTypes = {
  pand: PropTypes.shape({
    label: PropTypes.string,
    status: PropTypes.string,
    year: PropTypes.string
  }).isRequired,
  panoUrl: PropTypes.string
};

export default MapDetailAdressenPand;
