import React from 'react';
import PropTypes from 'prop-types';

import MapDetailResultItem from './MapDetailResultItem';

const MapDetailKadastraalObject = ({ panoUrl, kadastraalObject }) => (
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
        <h1 className="map-detail-result__header-title">Kadastraal object</h1>
        <h2 className="map-detail-result__header-subtitle">{kadastraalObject.label}</h2>
      </div>
    </header>
    <ul className="map-detail-result__list">
      <MapDetailResultItem
        label="Objectnummer"
        value={kadastraalObject.objectNumber}
      />
      {kadastraalObject.kadastraleGemeente && (
        <MapDetailResultItem
          label="Kadastrale gemeente"
          value={`${kadastraalObject.kadastraleGemeente.label}: ${kadastraalObject.kadastraleGemeente.name}`}
        />
      )}
      <MapDetailResultItem
        label="Grootte"
        value={(kadastraalObject.size || kadastraalObject.size === 0) ? `${kadastraalObject.size} m²` : ''}
      />
    </ul>
  </section>
);

MapDetailKadastraalObject.defaultProps = {
  panoUrl: ''
};

MapDetailKadastraalObject.propTypes = {
  kadastraalObject: PropTypes.shape({
    kadastraleGemeente: PropTypes.shape({
      label: PropTypes.string,
      name: PropTypes.string
    }),
    label: PropTypes.string,
    objectNumber: PropTypes.string,
    size: PropTypes.number
  }).isRequired,
  panoUrl: PropTypes.string
};

export default MapDetailKadastraalObject;
