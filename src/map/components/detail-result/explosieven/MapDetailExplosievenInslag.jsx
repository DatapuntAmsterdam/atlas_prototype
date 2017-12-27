import React from 'react';
import PropTypes from 'prop-types';

import MapDetailResultDateItem from '../MapDetailResultDateItem';
import MapDetailResultItem from '../MapDetailResultItem';

const MapDetailExplosievenInslag = ({ panoUrl, inslag }) => (
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
        <h2 className="map-detail-result__header-subtitle">{inslag.label}</h2>
      </div>
    </header>
    <ul className="map-detail-result__list">
      <MapDetailResultDateItem
        label="Datum van inslag"
        date={inslag.date}
      />
      <MapDetailResultItem
        label="Soort handeling"
        value={inslag.type}
      />
      <MapDetailResultItem
        label="Bron"
        value={inslag.source}
      />
      <MapDetailResultItem
        label="Opmerkingen"
        value={inslag.remarks}
      />
    </ul>
  </section>
);

MapDetailExplosievenInslag.defaultProps = {
  panoUrl: ''
};

MapDetailExplosievenInslag.propTypes = {
  inslag: PropTypes.shape({
    date: PropTypes.instanceOf(Date),
    label: PropTypes.string,
    remarks: PropTypes.string,
    source: PropTypes.string,
    type: PropTypes.string
  }).isRequired,
  panoUrl: PropTypes.string
};

export default MapDetailExplosievenInslag;
