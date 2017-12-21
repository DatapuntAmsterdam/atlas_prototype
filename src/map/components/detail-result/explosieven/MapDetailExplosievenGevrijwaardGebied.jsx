import React from 'react';
import PropTypes from 'prop-types';

import MapDetailResultItem from '../MapDetailResultItem';

const MapDetailExplosievenGevrijwaardGebied = ({ panoUrl, gevrijwaardGebied }) => (
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
        <h1 className="map-detail-result__header-title">Gevrijwaard gebied</h1>
        <h2 className="map-detail-result__header-subtitle">{gevrijwaardGebied.label}</h2>
      </div>
    </header>
    <ul className="map-detail-result__list">
      <MapDetailResultItem
        label="Datum rapport"
        value={gevrijwaardGebied.date}
      />
      <MapDetailResultItem
        label="Soort handeling"
        value={gevrijwaardGebied.type}
      />
      <MapDetailResultItem
        label="Bron"
        value={gevrijwaardGebied.source}
      />
      <MapDetailResultItem
        label="Opmerkingen"
        value={gevrijwaardGebied.remarks}
      />
    </ul>
  </section>
);

MapDetailExplosievenGevrijwaardGebied.defaultProps = {
  panoUrl: ''
};

MapDetailExplosievenGevrijwaardGebied.propTypes = {
  gevrijwaardGebied: PropTypes.shape({
    date: PropTypes.string,
    label: PropTypes.string,
    remarks: PropTypes.string,
    source: PropTypes.string,
    type: PropTypes.string
  }).isRequired,
  panoUrl: PropTypes.string
};

export default MapDetailExplosievenGevrijwaardGebied;
