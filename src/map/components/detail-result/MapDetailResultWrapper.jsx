import React from 'react';
import PropTypes from 'prop-types';

const MapDetailResultWrapper = ({
  children, panoUrl, subTitle, title, onMaximize, onPanoPreviewClick
}) => (
  <section className="map-detail-result">
    <header
      className={`
        map-detail-result__header
        map-detail-result__header--${panoUrl ? 'pano' : 'no-pano'}
      `}
    >
      {panoUrl && (
        <button
          className={`
            map-detail-result__header-pano-button
            map-detail-result__header-pano-button--${panoUrl ? 'enabled' : 'disabled'}
          `}
          disabled={!panoUrl}
          title={panoUrl ? 'Panoramabeeld tonen' : 'Geen Panoramabeeld beschikbaar'}
          onClick={onPanoPreviewClick}
        >
          <img
            alt="Panoramabeeld"
            className="map-detail-result__header-pano"
            height="292"
            src={panoUrl}
            width="438"
          />
        </button>
      )}
      <div className="map-detail-result__header-container">
        <h1 className="map-detail-result__header-title">{title}</h1>
        {subTitle && (
          <h2 className="map-detail-result__header-subtitle">{subTitle}</h2>
        )}
      </div>
    </header>
    <div className="map-detail-result__scroll-wrapper">
      {children && (
          [children]
      )}
      <footer className="map-search-results__footer">
        <button
          className="map-search-results__button"
          onClick={onMaximize}
          title="Volledig weergeven"
        >
          <span className="
            map-search-results__button-icon
            map-search-results__button-icon--maximize"
          />
          Volledig weergeven
        </button>
      </footer>
    </div>
  </section>
);

MapDetailResultWrapper.defaultProps = {
  children: null,
  subTitle: '',
  onPanoPreviewClick: /* istanbul ignore next */ () => null
};

MapDetailResultWrapper.propTypes = {
  children: PropTypes.element,
  panoUrl: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
  title: PropTypes.string.isRequired,
  onMaximize: PropTypes.func.isRequired,
  onPanoPreviewClick: PropTypes.func
};

export default MapDetailResultWrapper;
