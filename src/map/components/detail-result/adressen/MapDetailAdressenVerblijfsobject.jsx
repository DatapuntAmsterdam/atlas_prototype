import React from 'react';
import PropTypes from 'prop-types';

import MapDetailResultItem from '../MapDetailResultItem';
import MapDetailAdressenVerblijfsobjectGebruiksdoelenItem from './MapDetailAdressenVerblijfsobjectGebruiksdoelenItem';

const MapDetailAdressenVerblijfsobject = ({ panoUrl, verblijfsobject }) => (
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
        <h1 className="map-detail-result__header-title">Adres</h1>
        <h2 className="map-detail-result__header-subtitle">{verblijfsobject.label}</h2>
      </div>
    </header>
    <ul className="map-detail-result__list">
      <MapDetailAdressenVerblijfsobjectGebruiksdoelenItem
        gebruiksdoelen={verblijfsobject.gebruiksdoelen}
      />
      <MapDetailResultItem
        label="Oppervlakte"
        value={(verblijfsobject.size || verblijfsobject.size === 0) ? `${verblijfsobject.size} m²` : ''}
      />
      <MapDetailResultItem
        label="Type woonobject"
        value={verblijfsobject.type}
      />
      <MapDetailResultItem
        label="Eigendomsverhouding"
        value={verblijfsobject.eigendomsverhouding}
      />
    </ul>
  </section>
);

MapDetailAdressenVerblijfsobject.defaultProps = {
  panoUrl: ''
};

MapDetailAdressenVerblijfsobject.propTypes = {
  verblijfsobject: PropTypes.shape({
    eigendomsverhouding: PropTypes.string,
    label: PropTypes.string,
    size: PropTypes.number,
    type: PropTypes.string
  }).isRequired,
  panoUrl: PropTypes.string
};

export default MapDetailAdressenVerblijfsobject;
