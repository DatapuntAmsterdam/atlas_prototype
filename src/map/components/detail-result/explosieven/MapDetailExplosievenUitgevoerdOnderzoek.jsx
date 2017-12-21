import React from 'react';
import PropTypes from 'prop-types';

import MapDetailResultItem from '../MapDetailResultItem';

const MapDetailExplosievenUitgevoerdOnderzoek = ({ panoUrl, uitgevoerdOnderzoek }) => (
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
        <h1 className="map-detail-result__header-title">Reeds uitgevoerd CE onderzoek</h1>
        <h2 className="map-detail-result__header-subtitle">{uitgevoerdOnderzoek.label}</h2>
      </div>
    </header>
    <ul className="map-detail-result__list">
      <MapDetailResultItem
        label="Datum rapport"
        value={uitgevoerdOnderzoek.date}
      />
      <MapDetailResultItem
        label="Soort rapportage"
        value={uitgevoerdOnderzoek.type}
      />
      <MapDetailResultItem
        label="Onderzoeksgebied"
        value={uitgevoerdOnderzoek.onderzoeksgebied}
      />
      <MapDetailResultItem
        label="Verdacht gebied"
        value={uitgevoerdOnderzoek.verdachtGebied}
      />
    </ul>
  </section>
);

MapDetailExplosievenUitgevoerdOnderzoek.defaultProps = {
  panoUrl: ''
};

MapDetailExplosievenUitgevoerdOnderzoek.propTypes = {
  uitgevoerdOnderzoek: PropTypes.shape({
    date: PropTypes.string,
    label: PropTypes.string,
    onderzoeksgebied: PropTypes.string,
    type: PropTypes.string,
    verdachtGebied: PropTypes.string
  }).isRequired,
  panoUrl: PropTypes.string
};

export default MapDetailExplosievenUitgevoerdOnderzoek;
