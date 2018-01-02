import React from 'react';
import PropTypes from 'prop-types';

import MapDetailResultItem from '../MapDetailResultItem';
import MapDetailAdressenVerblijfsobjectGebruiksdoelenItem from './MapDetailAdressenVerblijfsobjectGebruiksdoelenItem';

const MapDetailAdressenVerblijfsobject = ({ verblijfsobject }) => (
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
);

MapDetailAdressenVerblijfsobject.propTypes = {
  verblijfsobject: PropTypes.shape({
    eigendomsverhouding: PropTypes.string,
    gebruiksdoelen: PropTypes.array,
    label: PropTypes.string,
    size: PropTypes.number,
    type: PropTypes.string
  }).isRequired
};

export default MapDetailAdressenVerblijfsobject;
