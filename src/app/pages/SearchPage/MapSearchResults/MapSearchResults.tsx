import { themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'
import type { FunctionComponent } from 'react'
import IconMap from '../../../../shared/assets/icons/data/IconMap.svg'
import IconMapLayers from '../../../../shared/assets/icons/IconMapLayers.svg'
import SearchLink from '../../../components/Links/SearchLink/SearchLink'
import NoSearchResults from '../../../components/NoSearchResults'
import SearchHeading from '../../../components/SearchHeading/SearchHeading'
import { toMapSearch } from '../../../links'
import formatCount from '../../../utils/formatCount'
import MapCollectionSearchResults from './MapCollectionSearchResults'
import MapLayerSearchResults from './MapLayerSearchResults'
import { routing } from '../../../routes'
import { activeFiltersParam } from '../query-params'
import useBuildQueryString from '../../../utils/useBuildQueryString'

export interface MapSearchResultsProps {
  query: string
  results: Array<{ count: number; label: string; type: MapType; results: any[] }>
  label: string
  withPagination: boolean
  isOverviewPage: boolean
}

enum MapType {
  Layer = 'map-layer',
  Collection = 'map-collection',
}

interface SearchResultsProps {
  type: MapType
  results: any[]
  label: string
  totalCount: number
  withPagination: boolean
  icon: JSX.Element
  resultsComponent: FunctionComponent<{ results: any[] }>
  isOverviewPage: boolean
}

const Spacer = styled.div<{ large?: boolean }>`
  width: 100%;
  margin-bottom: ${({ large }) => (large ? themeSpacing(18) : themeSpacing(6))};
`

const SearchResults: FunctionComponent<SearchResultsProps> = ({
  type,
  results,
  label,
  totalCount,
  withPagination,
  isOverviewPage,
  icon,
  resultsComponent: ResultsComponent,
}) => {
  const { buildQueryString } = useBuildQueryString()
  return (
    (results.length > 0 && (
      <>
        <SearchHeading label={`${label} (${formatCount(totalCount)})`} icon={icon} />
        <ResultsComponent results={results} />
        {!withPagination && !isOverviewPage && totalCount > results.length && (
          <>
            <Spacer />
            <SearchLink
              to={{
                pathname: routing.mapSearch.path,
                search: buildQueryString([
                  [activeFiltersParam, [{ type: 'map-type', values: [type] }]],
                ]),
              }}
              label={`Alle ${label && label.toLowerCase()} tonen`}
            />
          </>
        )}
        <Spacer large={isOverviewPage} />
      </>
    )) ||
    null
  )
}

const MapSearchResults: FunctionComponent<MapSearchResultsProps> = ({
  query,
  results,
  label,
  withPagination,
  isOverviewPage,
}) => {
  // Get the total count for all data types
  const totalCount = results.reduce((acc: number, cur) => acc + cur.count, 0)
  const mapLayerData = results.find(({ type }) => type === MapType.Layer)
  const mapCollectionData = results.find(({ type }) => type === MapType.Collection)

  return totalCount > 0 ? (
    <>
      {mapLayerData && (
        <SearchResults
          type={MapType.Layer}
          results={mapLayerData.results}
          label={mapLayerData.label}
          totalCount={mapLayerData.count}
          withPagination={withPagination}
          icon={<IconMap />}
          resultsComponent={MapLayerSearchResults}
          isOverviewPage={isOverviewPage}
        />
      )}
      {mapCollectionData && (
        <SearchResults
          type={MapType.Collection}
          results={mapCollectionData.results}
          label={mapCollectionData.label}
          totalCount={mapCollectionData.count}
          withPagination={withPagination}
          icon={<IconMapLayers />}
          resultsComponent={MapCollectionSearchResults}
          isOverviewPage={isOverviewPage}
        />
      )}
    </>
  ) : (
    <NoSearchResults query={query} label={label} to={toMapSearch()} />
  )
}

export default MapSearchResults
