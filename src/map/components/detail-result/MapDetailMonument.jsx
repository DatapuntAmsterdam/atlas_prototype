import React from 'react';
import PropTypes from 'prop-types';

import MapDetailResultItem from './MapDetailResultItem';

const MapDetailMonument = ({ panoUrl, monument }) => (
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
        <h1 className="map-detail-result__header-title">Monument</h1>
        <h2 className="map-detail-result__header-subtitle">{monument.label}</h2>
      </div>
    </header>
    <ul className="map-detail-result__list">
      <MapDetailResultItem
        label="Nummer"
        value={`${monument.number}`}
      />
      <MapDetailResultItem
        label="Type"
        value={monument.type}
      />
      <MapDetailResultItem
        label="Status"
        value={monument.status}
      />
    </ul>
  </section>
);

MapDetailMonument.defaultProps = {
  panoUrl: ''
};

MapDetailMonument.propTypes = {
  monument: PropTypes.shape({
    label: PropTypes.string,
    number: PropTypes.string,
    status: PropTypes.string,
    type: PropTypes.string
  }).isRequired,
  panoUrl: PropTypes.string
};

export default MapDetailMonument;
