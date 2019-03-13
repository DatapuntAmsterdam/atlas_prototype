import React from 'react';
import PropTypes from 'prop-types';

import MapDetailResultItem from './MapDetailResultItem';
import MapDetailResultWrapper from './MapDetailResultWrapper';
import Notification from '../../../shared/components/notification/Notification';

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
      <li className="map-detail-result__notification">
        <Notification canClose={false}>
          <h3 className="c-panel__title">Disclaimer</h3>
          <p className="c-panel__paragraph">De grenzen van het winkelgebied zijn indicatief.
            Er kunnen geen rechten aan worden ontleend.</p>
        </Notification>
      </li>
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
