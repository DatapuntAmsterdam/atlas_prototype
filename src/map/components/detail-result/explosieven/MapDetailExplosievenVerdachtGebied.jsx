import React from 'react';
import PropTypes from 'prop-types';

import MapDetailResultItem from '../MapDetailResultItem';

const MapDetailExplosievenVerdachtGebied = ({ panoUrl, verdachtGebied }) => (
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
        <h1 className="map-detail-result__header-title">Verdacht gebied</h1>
        <h2 className="map-detail-result__header-subtitle">{verdachtGebied.label}</h2>
      </div>
    </header>
    <ul className="map-detail-result__list">
      <MapDetailResultItem
        label="Hoofdgroep"
        value={verdachtGebied.type}
      />
      <MapDetailResultItem
        label="Subsoort"
        value={verdachtGebied.subType}
      />
      <MapDetailResultItem
        label="Opmerkingen"
        value={verdachtGebied.remarks}
      />
    </ul>
  </section>
);

MapDetailExplosievenVerdachtGebied.defaultProps = {
  panoUrl: ''
};

MapDetailExplosievenVerdachtGebied.propTypes = {
  verdachtGebied: PropTypes.shape({
    label: PropTypes.string,
    remarks: PropTypes.string,
    subType: PropTypes.string,
    type: PropTypes.string
  }).isRequired,
  panoUrl: PropTypes.string
};

export default MapDetailExplosievenVerdachtGebied;
