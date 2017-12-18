import React from 'react';
import PropTypes from 'prop-types';

const MapDetailVestigingActiviteitenItem = ({ activities }) => (
  <div className="map-detail-result__item">
    <section className="map-detail-result__item-content">
      <div className="map-detail-result__item-label">SBI-activiteiten</div>
      <ul className="map-detail-result__item-value map-detail-result__item-list">
        {activities && activities.length && activities.slice(0, 5).map((activity) => (
          <li
            key={activity.sbiCode}
            className="map-detail-result__item-list-item"
          >
            {activity.sbiCode}: {activity.sbiDescription}
          </li>
        ))}
      </ul>
    </section>
  </div>
);

MapDetailVestigingActiviteitenItem.defaultProps = {
  activities: []
};

MapDetailVestigingActiviteitenItem.propTypes = {
  activities: PropTypes.arrayOf(PropTypes.shape({
    sbiCode: PropTypes.string,
    sbiDescription: PropTypes.string
  }))
};

export default MapDetailVestigingActiviteitenItem;
