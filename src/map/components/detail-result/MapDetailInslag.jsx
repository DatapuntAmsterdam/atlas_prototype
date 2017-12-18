import React from 'react';
import PropTypes from 'prop-types';

import MapDetailResultItem from './MapDetailResultItem';

const MapDetailInslag = ({ panoUrl, inslag }) => (
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
        <h1 className="map-detail-result__header-title">Inslag</h1>
        <h2 className="map-detail-result__header-subtitle">{inslag._display}</h2>
      </div>
    </header>
    <ul className="map-detail-result__list">
      <MapDetailResultItem
        label="Datum van inslag"
        value={inslag.datum_inslag}
      />
      <MapDetailResultItem
        label="Soort handeling"
        value={inslag.type}
      />
      <MapDetailResultItem
        label="Bron"
        value={inslag.bron}
      />
    </ul>
  </section>
);

MapDetailInslag.defaultProps = {
  panoUrl: ''
};

MapDetailInslag.propTypes = {
  inslag: PropTypes.shape({
    bron: PropTypes.string,
    datum_inslag: PropTypes.string,
    _display: PropTypes.string,
    type: PropTypes.string
  }).isRequired,
  panoUrl: PropTypes.string
};

export default MapDetailInslag;
