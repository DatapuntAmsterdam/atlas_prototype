import React from 'react';
import PropTypes from 'prop-types';

import MapDetailResultItem from './MapDetailResultItem';
import MapDetailResultWrapper from './MapDetailResultWrapper';

const MapDetailOplaadpunt = ({ panoUrl, oplaadpunt, onMaximize, onPanoPreviewClick }) => (
  <MapDetailResultWrapper
    panoUrl={panoUrl}
    onMaximize={onMaximize}
    onPanoPreviewClick={onPanoPreviewClick}
    subTitle={oplaadpunt.label}
    title="Oplaadpunt"
  >
    <ul className="map-detail-result__list">
      <MapDetailResultItem
        label="Adres"
        value={oplaadpunt.address}
      />
      <MapDetailResultItem
        label="Aantal"
        value={oplaadpunt.quantity}
      />
      <MapDetailResultItem
        label="Soort"
        value={oplaadpunt.type}
      />
      <MapDetailResultItem
        label="Capaciteit"
        value={oplaadpunt.capacity}
      />
      <MapDetailResultItem
        label="Connectortype"
        value={oplaadpunt.connectorType}
      />
      <MapDetailResultItem
        label="Status"
        value={oplaadpunt.currentStatus}
      />
    </ul>
  </MapDetailResultWrapper>
);

MapDetailOplaadpunt.propTypes = {
  panoUrl: PropTypes.string.isRequired,
  oplaadpunt: PropTypes.shape({
    address: PropTypes.string,
    quantity: PropTypes.string,
    type: PropTypes.string,
    label: PropTypes.string,
    capacity: PropTypes.string,
    connectorType: PropTypes.string,
    currentStatus: PropTypes.string
  }).isRequired,
  onMaximize: PropTypes.func.isRequired,
  onPanoPreviewClick: PropTypes.func.isRequired
};

export default MapDetailOplaadpunt;
