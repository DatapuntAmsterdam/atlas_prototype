import { Alert, Heading, Link, Paragraph, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import usePromise, { isPending, isRejected } from '@amsterdam/use-promise'
import type { FunctionComponent } from 'react'
import { useMemo } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components'
import { getScopes } from '../../../../../shared/services/auth/auth'
import formatNumber from '../../../../../shared/services/number-formatter/number-formatter'
import getDetailPageData from '../../../../utils/getDetailPageData'
import AuthAlert from '../../../../components/Alerts/AuthAlert'
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner'
import ShowMore from '../../../../components/ShowMore'
import { toDataDetail } from '../../../../links'
import useParam from '../../../../utils/useParam'
import type {
  MapSearchCategory,
  MapSearchResult,
} from '../../legacy/services/map-search/map-search'
import mapSearch from '../../legacy/services/map-search/map-search'
import { locationParam } from '../../query-params'
import useAsyncMapPanelHeader from '../../utils/useAsyncMapPanelHeader'
import PanoramaPreview from '../PanoramaPreview/PanoramaPreview'
import { wgs84ToRd } from '../../../../../shared/services/coordinate-reference-system'

const RESULT_LIMIT = 10

const CategoryHeading = styled(Heading)`
  margin-bottom: ${themeSpacing(2)};
  color: ${themeColor('secondary')};
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

const Message = styled(Paragraph)`
  margin: ${themeSpacing(4)} 0;
`

const StatusLabel = styled.span`
  font-weight: normal;
`

const CoordinatesLabel = styled.span`
  color: ${themeColor('tint', 'level5')};
`

const Coordinates = styled.p`
  margin-bottom: 0;
`

const StyledAuthAlert = styled(AuthAlert)`
  margin-top: ${themeSpacing(4)};
`

const StyledPanoramaPreview = styled(PanoramaPreview)`
  margin-bottom: ${themeSpacing(6)};
`

const EXCLUDED_RESULTS = 'vestigingen'

const MapSearchResults: FunctionComponent = () => {
  const [location] = useParam(locationParam)
  const result = usePromise(() => mapSearch(location), [location])
  const { x: rdX, y: rdY } = useMemo(
    () => (location ? wgs84ToRd(location) : { x: 0, y: 0 }),
    [location],
  )

  const coordinates = useMemo(
    () =>
      `${rdX.toFixed(2)}, ${rdY.toFixed(2)} (${location?.lat.toFixed(7) ?? ''}, ${
        location?.lng.toFixed(7) ?? ''
      })`,
    [rdX, rdY, location],
  )

  useAsyncMapPanelHeader(
    result,
    'Zoekresultaten voor locatie',
    null,
    <Coordinates>
      <CoordinatesLabel>Coördinaten: </CoordinatesLabel>
      {coordinates}
    </Coordinates>,
  )

  if (isRejected(result)) {
    return (
      <Alert level="error" data-testid="errorMessage">
        <Paragraph>
          Er is een fout opgetreden bij het laden van dit blok. Zorg dat er een locatie is opgegeven
          door op de kaart te klikken
        </Paragraph>
      </Alert>
    )
  }
  if (isPending(result)) {
    return <LoadingSpinner />
  }

  return (
    <>
      <StyledPanoramaPreview location={result.value.location} radius={180} aspect={2.5} />
      {result.value.results.length === 0 ? (
        <Message>Geen resultaten gevonden.</Message>
      ) : (
        result.value.results.map((category) => (
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
      )}
      {(!getScopes().includes('HR/R') || !getScopes().includes('BRK/RS')) && (
        <StyledAuthAlert excludedResults={EXCLUDED_RESULTS} />
      )}
    </>
  )
}

function renderResultItems(results: MapSearchResult[]) {
  return (
    <ShowMore limit={RESULT_LIMIT}>
      {results.map((result) => (
        // @ts-ignore
        <ResultLink
          key={result.type + result.label}
          forwardedAs={RouterLink}
          to={toDataDetail(getDetailPageData(result.uri as string))}
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
