import { mapPanelComponents } from '@datapunt/arm-core'
import { Heading, Link, Paragraph, Spinner, themeColor, themeSpacing } from '@datapunt/asc-ui'
import { LatLng } from 'leaflet'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import mapSearch, {
  MapSearchResponse,
  MapSearchResult,
} from '../../../../map/services/map-search/map-search'
import { getUser } from '../../../../shared/ducks/user/user'
import ShowMore from '../../../components/ShowMore'
import usePromise, { PromiseResult, PromiseStatus } from '../../../utils/usePromise'
import { Overlay } from '../types'
import PanoramaPreview from './PanoramaPreview'

const { MapPanelContent } = mapPanelComponents
const RESULT_LIMIT = 10

export interface PointSearchResultsProps {
  setLocation: (latLng: LatLng | null) => void
  location: LatLng
  currentOverlay: Overlay
}

const StyledMapPanelContent = styled(MapPanelContent)`
  width: 100%;
  padding: 0;
`

const CoordinatesText = styled.span`
  display: block;
  margin-bottom: ${themeSpacing(2)};
`

const CategoryHeading = styled(Heading)`
  margin-top: ${themeSpacing(6)};
  margin-bottom: ${themeSpacing(2)};
  color: ${themeColor('secondary', 'main')};
`

const ResultLink = styled(Link)`
  width: 100%;
  margin-bottom: ${themeSpacing(1)};
`

const SubCategoryBlock = styled.div`
  padding: ${themeSpacing(1, 0, 1, 4)};
  margin-bottom: ${themeSpacing(1)};
  border-left: 2px solid ${themeColor('tint', 'level4')};
  border-bottom: 1px solid ${themeColor('tint', 'level4')};
`

const LoadingSpinner = styled(Spinner)`
  display: flex;
  justify-content: center;
  width: 100%;
  margin: ${themeSpacing(4)} 0;
`

const Message = styled(Paragraph)`
  margin: ${themeSpacing(4)} 0;
`

const PointSearchResults: React.FC<PointSearchResultsProps> = ({
  setLocation,
  currentOverlay,
  location,
}) => {
  const user = useSelector(getUser)
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
    <StyledMapPanelContent
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
      <PanoramaPreview location={location} radius={180} aspect={2.5} />
      {renderResult(result)}
    </StyledMapPanelContent>
  )
}

function renderResult(result: PromiseResult<MapSearchResponse>) {
  switch (result.status) {
    case PromiseStatus.Fulfilled:
      return renderResponse(result.value)
    case PromiseStatus.Rejected:
      return <Message>Resultaten konden niet geladen worden.</Message>
    default:
      return <LoadingSpinner />
  }
}

function renderResponse({ results }: MapSearchResponse) {
  if (results.length === 0) {
    return <Message>Geen resultaten gevonden.</Message>
  }

  return results.map((category) => (
    <React.Fragment key={category.type}>
      <CategoryHeading as="h2">{category.categoryLabel}</CategoryHeading>
      {renderResultItems(category.results)}
      {category.subCategories.map((subCategory) => (
        <SubCategoryBlock key={category.type + subCategory.type}>
          <CategoryHeading as="h3">{category.categoryLabel}</CategoryHeading>
          {renderResultItems(category.results)}
        </SubCategoryBlock>
      ))}
    </React.Fragment>
  ))
}

function renderResultItems(results: MapSearchResult[]) {
  return (
    <ShowMore limit={RESULT_LIMIT}>
      {results.map((result) => (
        // TODO: Actually link to the details page for the result.
        <ResultLink key={result.type + result.label} href="/" variant="with-chevron">
          {result.label}
        </ResultLink>
      ))}
    </ShowMore>
  )
}

export default PointSearchResults