import React from 'react';
import PropTypes from 'prop-types';

const MapDetailVestigingBijzondereRechtstoestand = ({ values }) => {
  const isFaillissement = values.faillissement;
  const isSurseanceVanBetaling = values.status === 'Voorlopig' || values.status === 'Definitief';
  const isSpecial = isFaillissement || isSurseanceVanBetaling;

  return isSpecial && (
    <div className="map-detail-result__item">
      <section className="map-detail-result__item-content">
        <div className="map-detail-result__item-label">Soort bijzondere rechtstoestand</div>
        <div className="map-detail-result__item-value map-detail-result__item-value--alert">
          {isFaillissement && (
            <span>Faillissement</span>
          )}
          {isSurseanceVanBetaling && (
            <span>Surseance van betaling</span>
          )}
        </div>
      </section>
    </div>
  );
};

MapDetailVestigingBijzondereRechtstoestand.defaultProps = {
  values: {}
};

MapDetailVestigingBijzondereRechtstoestand.propTypes = {
  values: PropTypes.shape({
    faillissement: PropTypes.bool,
    status: PropTypes.string
  })
};

export default MapDetailVestigingBijzondereRechtstoestand;
