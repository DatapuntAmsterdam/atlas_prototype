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
        <h2 className="map-detail-result__header-subtitle">{kadastraalObject._display}</h2>
      </div>
    </header>
    <ul className="map-detail-result__list">
      <MapDetailResultItem
        label="Objectnummer"
        value={kadastraalObject.objectnummer}
      />
      {kadastraalObject.kadastrale_gemeente && (
        <MapDetailResultItem
          label="Kadastrale gemeente"
          value={`${kadastraalObject.kadastrale_gemeente._display}: ${kadastraalObject.kadastrale_gemeente.naam}`}
        />
      )}
      <MapDetailResultItem
        label="Grootte"
        value={(kadastraalObject.grootte || kadastraalObject.grootte === 0) && `${kadastraalObject.grootte} m²`}
      />
    </ul>
  </section>
);

MapDetailKadastraalObject.defaultProps = {
  panoUrl: ''
};

MapDetailKadastraalObject.propTypes = {
  kadastraalObject: PropTypes.shape({
    _display: PropTypes.string,
    grootte: PropTypes.number,
    kadastrale_gemeente: PropTypes.shape({
      _display: PropTypes.string,
      naam: PropTypes.string
    }),
    objectnummer: PropTypes.string
  }).isRequired,
  panoUrl: PropTypes.string
};

export default MapDetailKadastraalObject;
