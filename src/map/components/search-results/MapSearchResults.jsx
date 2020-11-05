import { Alert, Link } from '@amsterdam/asc-ui'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import React from 'react'
import NotificationLevel from '../../../app/models/notification'
import { wgs84ToRd } from '../../../shared/services/coordinate-reference-system'
import MapSearchResultsCategory from './map-search-results-category/MapSearchResultsCategory'
import useGetLegacyPanoramaPreview from '../../../app/utils/useGetLegacyPanoramaPreview'

const StyledLink = styled(Link)`
  padding: 0;
  height: 100%;
  width: 100%;
`

const MapSearchResults = ({
  isEmbed,
  resultLimit,
  location,
  missingLayers,
  onItemClick,
  results,
  onMaximize,
}) => {
  const rdCoordinates = wgs84ToRd(location)

  const limitResults = (categories) =>
    categories.map((category) => ({
      ...category,
      results: category.results.slice(0, resultLimit),
      subCategories: limitResults(category.subCategories),
      showMore: category.results.length > resultLimit,
    }))

  const { panoramaUrl, link, linkComponent } = useGetLegacyPanoramaPreview(location)

  return (
    <section className="map-search-results">
      <header
        className={`
          map-search-results__header
          map-search-results__header--${panoramaUrl ? 'pano' : 'no-pano'}
        `}
      >
        <StyledLink
          to={link}
          as={linkComponent}
          title={panoramaUrl ? 'Panoramabeeld tonen' : 'Geen Panoramabeeld beschikbaar'}
        >
          {panoramaUrl && (
            <img
              alt="Panoramabeeld"
              className="map-detail-result__header-pano"
              height="292"
              src={panoramaUrl}
              width="438"
            />
          )}
          <div className="map-search-results__header-container">
            <h1 className="map-search-results__header-title">Resultaten</h1>
            <h2 className="map-search-results__header-subtitle">
              {`locatie ${rdCoordinates.x.toFixed(2)}, ${rdCoordinates.y.toFixed(2)}`}
            </h2>
          </div>
        </StyledLink>
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
  isEmbed: PropTypes.bool.isRequired,
  resultLimit: PropTypes.number,
  results: PropTypes.array, // eslint-disable-line
}

export default MapSearchResults
