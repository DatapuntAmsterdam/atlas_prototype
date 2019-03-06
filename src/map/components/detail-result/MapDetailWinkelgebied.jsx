import React from 'react';
import PropTypes from 'prop-types';

import MapDetailResultItem from './MapDetailResultItem';
import MapDetailResultWrapper from './MapDetailResultWrapper';

const MapDetailWinkelgebied = ({ panoUrl, winkelgebied, onMaximize, onPanoPreviewClick }) => (
  <MapDetailResultWrapper
    panoUrl={panoUrl}
    onMaximize={onMaximize}
    onPanoPreviewClick={onPanoPreviewClick}
    subTitle={winkelgebied._display}
    title="Winkelgebied"
  >
    <ul className="map-detail-result__list">
      <MapDetailResultItem
        label="Gebied"
        value={winkelgebied.concnaam}
      />
    </ul>
  </MapDetailResultWrapper>
);

MapDetailWinkelgebied.propTypes = {
  panoUrl: PropTypes.string.isRequired,
  winkelgebied: PropTypes.shape({
    _display: PropTypes.string,
    concnaam: PropTypes.string
  }).isRequired,
  onMaximize: PropTypes.func.isRequired,
  onPanoPreviewClick: PropTypes.func.isRequired
};

export default MapDetailWinkelgebied;
