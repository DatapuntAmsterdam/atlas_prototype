import React from 'react';
import PropTypes from 'prop-types';

import Notification from '../../../shared/components/notification/Notification';
import MapDetailResultItem from './MapDetailResultItem';
import MapDetailAddressItem from './MapDetailAddressItem';
import MapDetailVestigingActiviteitenItem from './MapDetailVestigingActiviteitenItem';
import MapDetailVestigingBijzondereRechtstoestand from './MapDetailVestigingBijzondereRechtstoestand';

const MapDetailVestiging = ({ panoUrl, vestiging }) => (
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
        <h1 className="map-detail-result__header-title">Vestiging</h1>
        {vestiging.label && (
          <h2 className="map-detail-result__header-subtitle">{vestiging.label}</h2>
        )}
      </div>
    </header>
    {!vestiging.label && (
      <Notification>
        Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om
        maatschappelijke activiteiten en vestigingen te bekijken.
      </Notification>
    )}
    {vestiging.label && (
      <ul className="map-detail-result__list">
        <MapDetailResultItem
          label="KvK-nummer"
          value={vestiging.kvkNumber}
        />
        <MapDetailAddressItem
          label="Bezoekadres"
          values={vestiging.visitingAddress}
        />
        <MapDetailVestigingActiviteitenItem activities={vestiging.activities} />
        <MapDetailVestigingBijzondereRechtstoestand
          values={vestiging.bijzondereRechtstoestand}
        />
      </ul>
    )}
  </section>
);

MapDetailVestiging.defaultProps = {
  panoUrl: ''
};

MapDetailVestiging.propTypes = {
  panoUrl: PropTypes.string,
  vestiging: PropTypes.shape({
    activities: PropTypes.object,
    bijzondereRechtstoestand: PropTypes.string,
    kvkNumber: PropTypes.string,
    label: PropTypes.string,
    visitingAddress: PropTypes.string
  }).isRequired
};

export default MapDetailVestiging;
