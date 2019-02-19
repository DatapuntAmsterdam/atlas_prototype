import React from 'react';
import PropTypes from 'prop-types';

import MapDetailResultItem from './MapDetailResultItem';
import MapDetailResultWrapper from './MapDetailResultWrapper';

const MapDetailParkeervak = ({ panoUrl, item, onMaximize, onPanoPreviewClick }) => (
  <MapDetailResultWrapper
    panoUrl={panoUrl}
    onMaximize={onMaximize}
    onPanoPreviewClick={onPanoPreviewClick}
    subTitle={item.id}
    title="Parkeervak"
  >
    <ul className="map-detail-result__list">
      <MapDetailResultItem
        label="Straat"
        value={item.straatnaam}
      />
      <MapDetailResultItem
        label="Type"
        value={item.e_type_desc}
      />
      <MapDetailResultItem
        label="Bord"
        value={item.bord}
      />
    </ul>
  </MapDetailResultWrapper>
);

MapDetailParkeervak.propTypes = {
  item: PropTypes.shape({}).isRequired,
  panoUrl: PropTypes.string.isRequired,
  onMaximize: PropTypes.func.isRequired,
  onPanoPreviewClick: PropTypes.func.isRequired
};

export default MapDetailParkeervak;
