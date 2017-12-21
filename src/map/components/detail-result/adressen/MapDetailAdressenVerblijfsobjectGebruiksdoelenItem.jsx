import React from 'react';
import PropTypes from 'prop-types';

const MapDetailAdressenVerblijfsobjectGebruiksdoelenItem = ({ gebruiksdoelen }) => (
  <div className="map-detail-result__item">
    <section className="map-detail-result__item-content">
      <div className="map-detail-result__item-label">Gebruiksdoel</div>
      <ul className="map-detail-result__item-value map-detail-result__item-list">
        {gebruiksdoelen && gebruiksdoelen.length && gebruiksdoelen.slice(0, 5).map((item) => (
          <li
            key={item.code}
            className="map-detail-result__item-list-item"
          >
            {item.description}
            {item.descriptionPlus && (
              <span>: {item.descriptionPlus}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  </div>
);

MapDetailAdressenVerblijfsobjectGebruiksdoelenItem.defaultProps = {
  gebruiksdoelen: []
};

MapDetailAdressenVerblijfsobjectGebruiksdoelenItem.propTypes = {
  gebruiksdoelen: PropTypes.arrayOf(PropTypes.shape({
    code: PropTypes.string,
    description: PropTypes.string
  }))
};

export default MapDetailAdressenVerblijfsobjectGebruiksdoelenItem;
