import React from 'react';
import PropTypes from 'prop-types';

import MapDetailResultItem from './MapDetailResultItem';

const MapDetailMeetbout = ({ panoUrl, meetbout }) => (
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
        <h1 className="map-detail-result__header-title">Meetbout</h1>
        <h2 className="map-detail-result__header-subtitle">{meetbout.meetboutidentificatie}</h2>
      </div>
    </header>
    <ul className="map-detail-result__list">
      <MapDetailResultItem
        label="Status"
        value={meetbout.status}
      />
      <MapDetailResultItem
        label="Adres"
        value={meetbout.adres}
      />
    </ul>
  </section>
);

MapDetailMeetbout.defaultProps = {
  panoUrl: ''
};

MapDetailMeetbout.propTypes = {
  meetbout: PropTypes.shape({
    adres: PropTypes.string,
    meetboutidentificatie: PropTypes.string,
    status: PropTypes.string
  }).isRequired,
  panoUrl: PropTypes.string
};

export default MapDetailMeetbout;
