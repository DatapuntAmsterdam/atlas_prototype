import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { isEmbedded } from '../../../shared/ducks/ui/ui'

const MapDetailResultWrapper = ({
  children,
  panoUrl,
  subTitle,
  title,
  onMaximize,
  onPanoPreviewClick,
  isEmbed,
}) => (
  <section className="map-detail-result">
    <header
      className={`
      map-detail-result__header
      map-detail-result__header--${!isEmbed && panoUrl ? 'pano' : 'no-pano'}
    `}
    >
      <button
        type="button"
        className="map-detail-result__header-pano-button"
        disabled={!panoUrl || isEmbed}
        title={panoUrl ? 'Panoramabeeld tonen' : 'Geen Panoramabeeld beschikbaar'}
        onClick={onPanoPreviewClick}
      >
        {panoUrl && (
          <img
            alt="Panoramabeeld"
            className="map-detail-result__header-pano"
            height="292"
            src={panoUrl}
            width="438"
          />
        )}
        <div className="map-detail-result__header-container">
          <h1 className="map-detail-result__header-title">{title}</h1>
          {subTitle && <h2 className="map-detail-result__header-subtitle">{subTitle}</h2>}
        </div>
      </button>
    </header>
    <div className="map-detail-result__scroll-wrapper">
      {children && [children]}
      <footer className="map-search-results__footer">
        <button
          type="button"
          className="map-search-results__button"
          onClick={onMaximize}
          title="Volledig weergeven"
        >
          <span
            className={`
                    map-search-results__button-icon
                    map-search-results__button-icon--maximize
                  `}
          />
          Volledig weergeven
        </button>
      </footer>
    </div>
  </section>
)

MapDetailResultWrapper.defaultProps = {
  children: null,
  subTitle: '',
  onPanoPreviewClick: /* istanbul ignore next */ () => null,
}

MapDetailResultWrapper.propTypes = {
  children: PropTypes.element,
  isEmbed: PropTypes.bool.isRequired,
  panoUrl: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
  title: PropTypes.string.isRequired,
  onMaximize: PropTypes.func.isRequired,
  onPanoPreviewClick: PropTypes.func,
}

const mapStateToProps = state => ({
  isEmbed: isEmbedded(state),
})

export default connect(
  mapStateToProps,
  null,
)(MapDetailResultWrapper)
