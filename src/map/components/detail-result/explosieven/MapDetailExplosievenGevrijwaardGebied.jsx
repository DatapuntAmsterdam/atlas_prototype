import React from 'react';
import PropTypes from 'prop-types';

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
        <h2 className="map-detail-result__header-subtitle">{gevrijwaardGebied._display}</h2>
      </div>
    </header>
  </section>
);

MapDetailExplosievenGevrijwaardGebied.defaultProps = {
  panoUrl: ''
};

MapDetailExplosievenGevrijwaardGebied.propTypes = {
  gevrijwaardGebied: PropTypes.shape({
    label: PropTypes.string
  }).isRequired,
  panoUrl: PropTypes.string
};

export default MapDetailExplosievenGevrijwaardGebied;
