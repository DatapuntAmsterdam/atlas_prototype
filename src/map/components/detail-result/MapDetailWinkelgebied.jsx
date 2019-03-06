import React from 'react';
import PropTypes from 'prop-types';

import MapDetailResultItem from './MapDetailResultItem';
import MapDetailResultWrapper from './MapDetailResultWrapper';

const MapDetailWinkelgebied = ({ panoUrl, winkelgebied, onMaximize, onPanoPreviewClick }) => (
  <MapDetailResultWrapper
    panoUrl={panoUrl}
    onMaximize={onMaximize}
    onPanoPreviewClick={onPanoPreviewClick}
    subTitle={winkelgebied.label}
    title="Winkelgebied"
  >
    <ul className="map-detail-result__list">
      <MapDetailResultItem
        label="Categorie"
        value={winkelgebied.category}
      />
    </ul>
  </MapDetailResultWrapper>
);

MapDetailWinkelgebied.propTypes = {
  panoUrl: PropTypes.string.isRequired,
  winkelgebied: PropTypes.shape({
    label: PropTypes.string,
    category: PropTypes.string
  }).isRequired,
  onMaximize: PropTypes.func.isRequired,
  onPanoPreviewClick: PropTypes.func.isRequired
};

export default MapDetailWinkelgebied;
