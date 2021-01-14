import { Alert, Button, Heading, Link, themeSpacing } from '@amsterdam/asc-ui'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import PanoAlert from '../../../app/components/PanoAlert/PanoAlert'
import { getUser } from '../../../shared/ducks/user/user'
import { wgs84ToRd } from '../../../shared/services/coordinate-reference-system'
import MapSearchResultsCategory from './map-search-results-category/MapSearchResultsCategory'
import useGetLegacyPanoramaPreview from '../../../app/utils/useGetLegacyPanoramaPreview'
import Maximize from '../../../shared/assets/icons/icon-maximize.svg'

const StyledLink = styled(Link)`
  padding: 0;
  height: 100%;
  width: 100%;
`

const Header = styled.header`
  margin: 0 ${themeSpacing(3)};
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
  const user = useSelector(getUser)

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
      {panoramaUrl && user.authenticated ? (
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
            <img
              alt="Panoramabeeld"
              className="map-detail-result__header-pano"
              height="292"
              src={panoramaUrl}
              width="438"
            />
            <div className="map-search-results__header-container">
              <h1 className="map-search-results__header-title">Resultaten</h1>
              <h2 className="map-search-results__header-subtitle">
                {`locatie ${rdCoordinates.x.toFixed(2)}, ${rdCoordinates.y.toFixed(2)}`}
              </h2>
            </div>
          </StyledLink>
        </header>
      ) : (
        <PanoAlert />
      )}

      <div className="map-search-results__scroll-wrapper">
        {!user.authenticated && (
          <Header>
            <Heading styleAs="h4">Resultaten</Heading>
            <Heading styleAs="h6" as="h2">
              {`locatie ${rdCoordinates.x.toFixed(2)}, ${rdCoordinates.y.toFixed(2)}`}
            </Heading>
          </Header>
        )}
        <ul className="map-search-results__list">
          {missingLayers && (
            <li>
              <Alert
                level="info"
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
            <Button
              type="button"
              onClick={onMaximize}
              title="Volledig weergeven"
              iconLeft={<Maximize />}
              iconSize={21}
            >
              Volledig weergeven
            </Button>
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
