import { themeSpacing } from '@datapunt/asc-ui'
import React from 'react'
import styled from 'styled-components'
import { ReactComponent as IconMap } from '../../../../shared/assets/icons/data/IconMap.svg'
import { ReactComponent as IconMapLayers } from '../../../../shared/assets/icons/IconMapLayers.svg'
import { toMapSearch, toMapSearchType } from '../../../../store/redux-first-router/actions'
import SearchLink from '../../../components/Links/SearchLink/SearchLink'
import NoSearchResults from '../../../components/NoSearchResults'
import SearchHeading from '../../../components/SearchHeading/SearchHeading'
import formatCount from '../../../utils/formatCount'
import MapCollectionSearchResults from './MapCollectionSearchResults'
import MapLayerSearchResults from './MapLayerSearchResults'

export interface MapSearchResultsProps {
  query: string
  results: any[]
  label: string
  withPagination: boolean
  isOverviewPage: boolean
}

enum MapType {
  Layer = 'map-layer',
  Collection = 'map-collection',
}

const MapSearchResults: React.FC<MapSearchResultsProps> = ({
  query,
  results,
  label,
  withPagination,
  isOverviewPage,
}) => {
  // Get the total count for all data types
  const totalCount = results.reduce((acc, cur) => acc + cur.count, 0)
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
    <NoSearchResults query={query} label={label} to={toMapSearch(null, false, false, false)} />
  )
}

export default MapSearchResults

interface SearchResultsProps {
  type: MapType
  results: any
  label: string
  totalCount: number
  withPagination: boolean
  icon: JSX.Element
  resultsComponent: React.FC<{ results: any[] }>
  isOverviewPage: boolean
}

const Spacer = styled.div<{ large?: boolean }>`
  width: 100%;
  margin-bottom: ${({ large }) => (large ? themeSpacing(18) : themeSpacing(6))};
`

const SearchResults: React.FC<SearchResultsProps> = ({
  type,
  results,
  label,
  totalCount,
  withPagination,
  isOverviewPage,
  icon,
  resultsComponent: ResultsComponent,
}) => {
  return (
    (results.length > 0 && (
      <>
        <SearchHeading label={`${label} (${formatCount(totalCount)})`} icon={icon} />
        <ResultsComponent results={results} />
        {!withPagination && !isOverviewPage && totalCount > results.length && (
          <>
            <Spacer />
            <SearchLink
              to={toMapSearchType(type)}
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
