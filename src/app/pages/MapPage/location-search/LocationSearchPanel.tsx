import { DrawerPanelHeader, DrawerPanelProps, LargeDrawerPanel } from '@amsterdam/arm-core'
import { Heading, Link, Paragraph, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import { LatLngLiteral } from 'leaflet'
import React, { FunctionComponent, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components'
import mapSearch, {
  MapSearchCategory,
  MapSearchResult,
} from '../../../../map/services/map-search/map-search'
import { getUser } from '../../../../shared/ducks/user/user'
import formatNumber from '../../../../shared/services/number-formatter/number-formatter'
import { getDetailPageData, getDetailPageData } from '../../../../store/redux-first-router/actions'
import AuthAlert from '../../../components/Alerts/AuthAlert'
import PromiseResult from '../../../components/PromiseResult/PromiseResult'
import ShowMore from '../../../components/ShowMore'
import useParam from '../../../utils/useParam'
import buildDetailUrl from '../detail/buildDetailUrl'
import { locationParam } from '../query-params'
import PanoramaPreview from '../PanoramaPreview'

const RESULT_LIMIT = 10

const CoordinatesText = styled.span`
  display: block;
  margin-bottom: ${themeSpacing(2)};
`

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

const StyledAuthAlert = styled(AuthAlert)`
  margin-top: ${themeSpacing(4)};
`

const StyledPanoramaPreview = styled(PanoramaPreview)`
  margin-bottom: ${themeSpacing(6)};
`

const EXCLUDED_RESULTS = 'vestigingen'

export interface MapSearchPanelProps extends DrawerPanelProps {
  location: LatLngLiteral
}

const LocationSearchPanel: FunctionComponent<MapSearchPanelProps> = ({
  location,
  ...otherProps
}) => {
  const user = useSelector(getUser)
  const [location, setLocation] = useParam(locationParam)
  const factory = () => mapSearch(user, location)

  return (
    <LargeDrawerPanel {...otherProps}>
      <DrawerPanelHeader onClose={() => setLocation(null)}>
        <Heading as="h2" styleAs="h1">
          Resultaten
        </Heading>
      </DrawerPanelHeader>
      <CoordinatesText>
        <strong>Locatie:</strong> {location.lat}, {location.lng}
      </CoordinatesText>
      <StyledPanoramaPreview location={location} radius={180} aspect={2.5} />
      {renderResult(result)}
      {(!user.scopes.includes('HR/R') || !user.scopes.includes('BRK/RS')) && (
        <StyledAuthAlert excludedResults={EXCLUDED_RESULTS} />
      )}
    </LargeDrawerPanel>
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

export default LocationSearchPanel
