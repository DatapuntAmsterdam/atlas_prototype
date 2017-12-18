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
        <h2 className="map-detail-result__header-subtitle">{monument._display}</h2>
      </div>
    </header>
    <ul className="map-detail-result__list">
      <MapDetailResultItem
        label="Nummer"
        value={`${monument.monumentnummer}`}
      />
      <MapDetailResultItem
        label="Type"
        value={monument.monumenttype}
      />
      <MapDetailResultItem
        label="Status"
        value={monument.monumentstatus}
      />
    </ul>
  </section>
);

MapDetailMonument.defaultProps = {
  panoUrl: ''
};

MapDetailMonument.propTypes = {
  monument: PropTypes.shape({
    _display: PropTypes.string,
    monumentnummer: PropTypes.string,
    monumentstatus: PropTypes.string,
    monumenttype: PropTypes.string
  }).isRequired,
  panoUrl: PropTypes.string
};

export default MapDetailMonument;
