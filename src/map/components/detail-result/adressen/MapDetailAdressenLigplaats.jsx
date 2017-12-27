import React from 'react';
import PropTypes from 'prop-types';

import MapDetailResultItem from '../MapDetailResultItem';

const MapDetailAdressenLigplaats = ({ panoUrl, ligplaats }) => (
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
        <h1 className="map-detail-result__header-title">Ligplaats</h1>
        <h2 className="map-detail-result__header-subtitle">{ligplaats.label}</h2>
      </div>
    </header>
    <ul className="map-detail-result__list">
      <MapDetailResultItem
        label="Status"
        value={ligplaats.status}
      />
    </ul>
  </section>
);

MapDetailAdressenLigplaats.defaultProps = {
  panoUrl: ''
};

MapDetailAdressenLigplaats.propTypes = {
  ligplaats: PropTypes.shape({
    label: PropTypes.string,
    status: PropTypes.string
  }).isRequired,
  panoUrl: PropTypes.string
};

export default MapDetailAdressenLigplaats;
