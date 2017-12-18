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
        {vestiging._display && (
          <h2 className="map-detail-result__header-subtitle">{vestiging._display}</h2>
        )}
      </div>
    </header>
    {!vestiging._display && (
      <Notification>
        Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om
        maatschappelijke activiteiten en vestigingen te bekijken.
      </Notification>
    )}
    {vestiging._display && (
      <ul className="map-detail-result__list">
        <MapDetailResultItem
          label="KvK-nummer"
          value={vestiging.kvkNummer}
        />
        <MapDetailAddressItem
          label="Bezoekadres"
          values={vestiging.bezoekadres}
        />
        <MapDetailVestigingActiviteitenItem activiteiten={vestiging.activiteiten} />
        <MapDetailVestigingBijzondereRechtstoestand
          values={vestiging._bijzondere_rechts_toestand}
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
    activiteiten: PropTypes.object,
    bezoekadres: PropTypes.string,
    _bijzondere_rechts_toestand: PropTypes.string,
    _display: PropTypes.string,
    kvkNummer: PropTypes.string
  }).isRequired
};

export default MapDetailVestiging;
