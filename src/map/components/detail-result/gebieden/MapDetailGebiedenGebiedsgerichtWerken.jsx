import React from 'react';
import PropTypes from 'prop-types';

const MapDetailGebiedenGebiedsgerichtWerken = ({ panoUrl, gebiedsgerichtWerken }) => (
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
        <h1 className="map-detail-result__header-title">GebiedsgerichtWerken</h1>
        <h2 className="map-detail-result__header-subtitle">{gebiedsgerichtWerken.label}</h2>
      </div>
    </header>
  </section>
);

MapDetailGebiedenGebiedsgerichtWerken.defaultProps = {
  panoUrl: ''
};

MapDetailGebiedenGebiedsgerichtWerken.propTypes = {
  gebiedsgerichtWerken: PropTypes.shape({
    label: PropTypes.string.isRequired
  }).isRequired,
  panoUrl: PropTypes.string
};

export default MapDetailGebiedenGebiedsgerichtWerken;
