import React from 'react';
import PropTypes from 'prop-types';

import formatNumber from '../../../shared/services/number-formatter/number-formatter';

import MapDetailResultItem from './MapDetailResultItem';
import MapDetailResultWrapper from './MapDetailResultWrapper';

const MapDetailOplaadpunt = ({ panoUrl, peilmerk, onMaximize, onPanoPreviewClick }) => (
  <MapDetailResultWrapper
    panoUrl={panoUrl}
    onMaximize={onMaximize}
    onPanoPreviewClick={onPanoPreviewClick}
    subTitle={peilmerk.label}
    title="NAP Peilmerk"
  >
    <ul className="map-detail-result__list">
      <MapDetailResultItem
        label="Hoogte NAP"
        value={(peilmerk.height || peilmerk.height === 0) ? `${formatNumber(peilmerk.height)} m` : ''}
      />
      <MapDetailResultItem
        label="Omschrijving"
        value={peilmerk.description}
      />
      <MapDetailResultItem
        label="Windrichting"
        value={peilmerk.windDirection}
      />
      {peilmerk.wallCoordinates && <MapDetailResultItem
        label="Muurvlakcoördinaten (cm)"
        cm
        value={`${peilmerk.wallCoordinates[0]}, ${peilmerk.wallCoordinates[1]}`}
      />}
    </ul>
  </MapDetailResultWrapper>
);

MapDetailOplaadpunt.propTypes = {
  panoUrl: PropTypes.string.isRequired,
  peilmerk: PropTypes.shape({
    description: PropTypes.string,
    height: PropTypes.number,
    label: PropTypes.string,
    windDirection: PropTypes.string,
    wallCoordinates: PropTypes.array
  }).isRequired,
  onMaximize: PropTypes.func.isRequired,
  onPanoPreviewClick: PropTypes.func.isRequired
};

export default MapDetailOplaadpunt;
