import { MapPanelContent } from '@amsterdam/arm-core'
import { Heading, Link, Paragraph, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import { LatLngLiteral } from 'leaflet'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components'
import mapSearch, {
  MapSearchCategory,
  MapSearchResponse,
  MapSearchResult,
} from '../../../../map/services/map-search/map-search'
import { getUser } from '../../../../shared/ducks/user/user'
import formatNumber from '../../../../shared/services/number-formatter/number-formatter'
import AuthAlert from '../../../components/Alerts/AuthAlert'
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner'
import ShowMore from '../../../components/ShowMore'
import useParam from '../../../utils/useParam'
import usePromise, { PromiseResult, PromiseStatus } from '../../../utils/usePromise'
import { locationParam } from '../query-params'
import { Overlay } from '../types'
import PanoramaPreview from './PanoramaPreview'
import buildDetailUrl from '../detail/buildDetailUrl'
import { getDetailPageData } from '../../../../store/redux-first-router/actions'

const RESULT_LIMIT = 10

const CoordinatesText = styled.span`
  display: block;
  margin-bottom: ${themeSpacing(2)};
`

const CategoryHeading = styled(Heading)`
  margin-bottom: ${themeSpacing(2)};
  color: ${themeColor('secondary', 'main')};
`

const ResultLink = styled(Link)`
  width: 100%;
  padding: ${themeSpacing(1)} 0;
  /* TODO: Remove this once this issue has been resolved: https://github.com/Amsterdam/amsterdam-styled-components/issues/727 */
  font-size: 16px;
  line-height: 20px;
`

const CategoryBlock = styled.div`
  margin-bottom: ${themeSpacing(6)};
`

const SubCategoryBlock = styled.div`
  padding: ${themeSpacing(4, 0, 2, 4)};
  margin-bottom: ${themeSpacing(1)};
  border-left: 2px solid ${themeColor('tint', 'level4')};
  border-bottom: 1px solid ${themeColor('tint', 'level4')};
`

const StyledLoadingSpinner = styled(LoadingSpinner)`
  margin: ${themeSpacing(4)} 0;
`

const Message = styled(Paragraph)`
  margin: ${themeSpacing(4)} 0;
`

const StatusLabel = styled.span`
  font-weight: normal;
`

const StyledAuthAlert = styled(AuthAlert)`
  margin-top: ${themeSpacing(4)};
`

const StyledPanoramaPreview = styled(PanoramaPreview)`
  margin-bottom: ${themeSpacing(6)};
`

const EXCLUDED_RESULTS = 'vestigingen'

export interface MapSearchPanelProps {
  location: LatLngLiteral
  currentOverlay: Overlay
}

const MapSearchResults: React.FC<MapSearchPanelProps> = ({ currentOverlay, location }) => {
  const user = useSelector(getUser)
  const [, setLocation] = useParam(locationParam)
  const result = usePromise(
    useMemo(
      () =>
        mapSearch(
          {
            latitude: location.lat,
            longitude: location.lng,
          },
          user,
        ),
      [location.lat, location.lng, user],
    ),
  )

  return (
    <MapPanelContent
      title="Resultaten"
      animate
      stackOrder={currentOverlay === Overlay.Results ? 2 : 1}
      onClose={() => {
        setLocation(null)
      }}
    >
      <CoordinatesText>
        <strong>Locatie:</strong> {location.lat}, {location.lng}
      </CoordinatesText>
      <StyledPanoramaPreview location={location} radius={180} aspect={2.5} />
      {renderResult(result)}
      {(!user.scopes.includes('HR/R') || !user.scopes.includes('BRK/RS')) && (
        <StyledAuthAlert excludedResults={EXCLUDED_RESULTS} />
      )}
    </MapPanelContent>
  )
}

function renderResult(result: PromiseResult<MapSearchResponse>) {
  switch (result.status) {
    case PromiseStatus.Fulfilled:
      return renderResponse(result.value)
    case PromiseStatus.Rejected:
      return <Message>Resultaten konden niet geladen worden.</Message>
    default:
      return <StyledLoadingSpinner />
  }
}

function renderResponse({ results }: MapSearchResponse) {
  if (results.length === 0) {
    return <Message>Geen resultaten gevonden.</Message>
  }

  return results.map((category) => (
    <CategoryBlock key={category.type}>
      <CategoryHeading as="h2">{formatCategoryTitle(category)}</CategoryHeading>
      {renderResultItems(category.results)}
      {category.subCategories.map((subCategory) => (
        <SubCategoryBlock key={category.type + subCategory.type}>
          <CategoryHeading as="h3">{formatCategoryTitle(subCategory)}</CategoryHeading>
          {renderResultItems(subCategory.results)}
        </SubCategoryBlock>
      ))}
    </CategoryBlock>
  ))
}

function renderResultItems(results: MapSearchResult[]) {
  return (
    <ShowMore limit={RESULT_LIMIT}>
      {results.map((result) => (
        // @ts-ignore
        <ResultLink
          key={result.type + result.label}
          forwardedAs={RouterLink}
          to={buildDetailUrl(getDetailPageData(result.uri))}
          inList
        >
          {result.label}
          {result.statusLabel && (
            <>
              &nbsp;<StatusLabel>({result.statusLabel})</StatusLabel>
            </>
          )}
        </ResultLink>
      ))}
    </ShowMore>
  )
}

function formatCategoryTitle(category: MapSearchCategory) {
  return category.results.length > 1
    ? `${category.categoryLabelPlural} (${formatNumber(category.results.length)})`
    : category.categoryLabel
}

export default MapSearchResults
