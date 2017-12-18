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
        <h2 className="map-detail-result__header-subtitle">{peilmerk.peilmerkidentificatie}</h2>
      </div>
    </header>
    <ul className="map-detail-result__list">
      <MapDetailResultItem
        label="Hoogte NAP"
        value={(peilmerk.hoogte_nap || peilmerk.hoogte_nap === 0) && `${peilmerk.hoogte_nap} m`}
      />
      <MapDetailResultItem
        label="Jaar"
        value={peilmerk.jaar && peilmerk.jaar.toString()}
      />
      <MapDetailResultItem
        label="Omschrijving"
        value={peilmerk.omschrijving}
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
    hoogte_nap: PropTypes.string,
    jaar: PropTypes.string,
    omschrijving: PropTypes.string,
    peilmerkidentificatie: PropTypes.string
  }).isRequired
};

export default MapDetailNapPeilmerk;
