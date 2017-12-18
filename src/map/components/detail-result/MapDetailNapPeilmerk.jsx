import React from 'react';
import PropTypes from 'prop-types';

import MapDetailResultItem from './MapDetailResultItem';

const MapDetailNapPeilmerk = ({ panoUrl, peilmerk }) => (
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
        <h1 className="map-detail-result__header-title">NAP Peilmerk</h1>
        <h2 className="map-detail-result__header-subtitle">{peilmerk.label}</h2>
      </div>
    </header>
    <ul className="map-detail-result__list">
      <MapDetailResultItem
        label="Hoogte NAP"
        value={(peilmerk.height || peilmerk.height === 0) && `${peilmerk.height} m`}
      />
      <MapDetailResultItem
        label="Jaar"
        value={peilmerk.year && peilmerk.year.toString()}
      />
      <MapDetailResultItem
        label="Omschrijving"
        value={peilmerk.description}
      />
    </ul>
  </section>
);

MapDetailNapPeilmerk.defaultProps = {
  panoUrl: ''
};

MapDetailNapPeilmerk.propTypes = {
  panoUrl: PropTypes.string,
  peilmerk: PropTypes.shape({
    description: PropTypes.string,
    height: PropTypes.string,
    label: PropTypes.string,
    year: PropTypes.string
  }).isRequired
};

export default MapDetailNapPeilmerk;
