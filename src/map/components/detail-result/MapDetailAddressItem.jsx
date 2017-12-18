import React from 'react';
import PropTypes from 'prop-types';

const MapDetailAddressItem = ({ label, values }) => (
  <div className="map-detail-result__item">
    <section className="map-detail-result__item-content">
      <div className="map-detail-result__item-label">{label}</div>
      <div className="map-detail-result__item-value">
        <div>{values.straatnaam} {values.huisnummer} {values.huisnummertoevoeging}</div>
        <div>{values.postcode} {values.plaats}</div>
      </div>
    </section>
  </div>
);

MapDetailAddressItem.propTypes = {
  label: PropTypes.string.isRequired,
  values: PropTypes.shape({
    huisnummer: PropTypes.number,
    huisnummertoevoeging: PropTypes.string,
    plaats: PropTypes.string,
    postcode: PropTypes.string,
    straatnaam: PropTypes.string
  }).isRequired
};

export default MapDetailAddressItem;
