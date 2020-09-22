import { Alert } from '@amsterdam/asc-ui'
import PropTypes from 'prop-types'
import React from 'react'
import NotificationLevel from '../../../app/models/notification'
import { wgs84ToRd } from '../../../shared/services/coordinate-reference-system'
import MapSearchResultsCategory from './map-search-results-category/MapSearchResultsCategory'

const MapSearchResults = ({
  isEmbed,
  resultLimit,
  location,
  missingLayers,
  onItemClick,
  panoUrl,
  results,
  onMaximize,
  onPanoPreviewClick,
}) => {
  const rdCoordinates = wgs84ToRd(location)

  const limitResults = (categories) =>
    categories.map((category) => ({
      ...category,
      results: category.results.slice(0, resultLimit),
      subCategories: limitResults(category.subCategories),
      showMore: category.results.length > resultLimit,
    }))

  return (
    <section className="map-search-results">
      <header
        className={`
          map-search-results__header
          map-search-results__header--${panoUrl ? 'pano' : 'no-pano'}
        `}
      >
        <button
          type="button"
          className={`
            map-search-results__header-pano-button
            map-search-results__header-pano-button--${panoUrl ? 'enabled' : 'disabled'}
          `}
          disabled={!panoUrl}
          onClick={onPanoPreviewClick}
          title={panoUrl ? 'Panoramabeeld tonen' : 'Geen Panoramabeeld beschikbaar'}
        >
          {panoUrl && (
            <img
              alt="Panoramabeeld"
              className="map-search-results__header-pano"
              height="292"
              src={panoUrl}
              width="438"
            />
          )}
          <div className="map-search-results__header-container">
            <h1 className="map-search-results__header-title">Resultaten</h1>
            <h2 className="map-search-results__header-subtitle">
              {`locatie ${rdCoordinates.x.toFixed(2)}, ${rdCoordinates.y.toFixed(2)}`}
            </h2>
          </div>
        </button>
      </header>
      <div className="map-search-results__scroll-wrapper">
        <ul className="map-search-results__list">
          {missingLayers && (
            <li>
              <Alert
                level={NotificationLevel.Attention}
                dismissible
                compact
              >{`Geen details beschikbaar van: ${missingLayers}`}</Alert>
            </li>
          )}
          {limitResults(results).map((mainCategory) => (
            <MapSearchResultsCategory
              key={mainCategory.categoryLabel}
              category={mainCategory}
              onItemClick={onItemClick}
              onShowMoreClick={onMaximize}
            />
          ))}
        </ul>
        {!isEmbed && (
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
        )}
      </div>
    </section>
  )
}

MapSearchResults.defaultProps = {
  resultLimit: 25,
}

MapSearchResults.propTypes = {
  location: PropTypes.shape({}).isRequired,
  missingLayers: PropTypes.string, // eslint-disable-line
  onItemClick: PropTypes.func.isRequired,
  onMaximize: PropTypes.func.isRequired,
  onPanoPreviewClick: PropTypes.func.isRequired,
  isEmbed: PropTypes.bool.isRequired,
  resultLimit: PropTypes.number,
  panoUrl: PropTypes.string, // eslint-disable-line
  results: PropTypes.array, // eslint-disable-line
}

export default MapSearchResults
