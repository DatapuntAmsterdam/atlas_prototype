import React from 'react';
import PropTypes from 'prop-types';

import MapDetailResultItem from './MapDetailResultItem';
import MapDetailResultWrapper from './MapDetailResultWrapper';

const MapDetailKadastraalObject = ({
  panoUrl, kadastraalObject, onMaximize, onPanoPreviewClick
}) => (
  <MapDetailResultWrapper
    panoUrl={panoUrl}
    onMaximize={onMaximize}
    onPanoPreviewClick={onPanoPreviewClick}
    subTitle={kadastraalObject.label}
    title="Kadastraal object"
  >
    <ul className="map-detail-result__list">
      {kadastraalObject.kadastraleGemeente && (
        <MapDetailResultItem
          label="Kadastrale gemeente"
          value={kadastraalObject.kadastraleGemeente.name}
        />
      )}
      <MapDetailResultItem
        label="Gemeente"
        value={kadastraalObject.kadastraleGemeente.gemeente}
      />
      <MapDetailResultItem
        label="Grootte"
        value={(kadastraalObject.size || kadastraalObject.size === 0) ? `${kadastraalObject.size.toLocaleString('nl-NL')} m²` : ''}
      />
    </ul>
  </MapDetailResultWrapper>
);

MapDetailKadastraalObject.propTypes = {
  kadastraalObject: PropTypes.shape({
    kadastraleGemeente: PropTypes.shape({
      label: PropTypes.string,
      name: PropTypes.string,
      gemeente: PropTypes.string
    }),
    label: PropTypes.string,
    size: PropTypes.number
  }).isRequired,
  panoUrl: PropTypes.string.isRequired,
  onMaximize: PropTypes.func.isRequired,
  onPanoPreviewClick: PropTypes.func.isRequired
};

export default MapDetailKadastraalObject;
