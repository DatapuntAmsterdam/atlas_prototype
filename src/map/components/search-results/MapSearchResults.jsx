import { Alert, Button, Heading, Link, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import PanoAlert from '../../../app/components/PanoAlert/PanoAlert'
import { getUser } from '../../../shared/ducks/user/user'
import { wgs84ToRd } from '../../../shared/services/coordinate-reference-system'
import MapSearchResultsCategory from './map-search-results-category/MapSearchResultsCategory'
import useGetLegacyPanoramaPreview from '../../../app/utils/useGetLegacyPanoramaPreview'
import Maximize from '../../../shared/assets/icons/icon-maximize.svg'
import usePromise from '../../../app/utils/usePromise'
import { fetchProxy } from '../../../shared/services/api/api'
import { ForbiddenError } from '../../../shared/services/api/customError'

const StyledLink = styled(Link)`
  padding: 0;
  height: 100%;
  width: 100%;
`

const Header = styled.header`
  margin: 0 ${themeSpacing(3)};
`

const StyledButton = styled(Button)`
  background-color: ${themeColor('tint', 'level1')};

  svg path {
    fill: ${themeColor('primary')};
  }
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
  const result = usePromise(
    // A small response that will only be available on gov. network
    () => fetchProxy('https://acc.api.data.amsterdam.nl/brk/?format=json'),
    [],
  )

  return (
    <section className="map-search-results">
      {panoramaUrl && result.status === 'fulfilled' ? (
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
        result.status === 'rejected' && result.error instanceof ForbiddenError && <PanoAlert />
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
            <StyledButton type="button" onClick={onMaximize} iconLeft={<Maximize />} iconSize={21}>
              Volledig weergeven
            </StyledButton>
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
