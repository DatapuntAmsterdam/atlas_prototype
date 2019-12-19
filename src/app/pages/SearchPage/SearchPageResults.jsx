import React, { memo } from 'react'
import styled from '@datapunt/asc-core'
import { Column, Heading, themeSpacing } from '@datapunt/asc-ui'
import Panel from '../../components/Panel/Panel'
import LoadingIndicator from '../../../shared/components/loading-indicator/LoadingIndicator'
import PAGES from '../../pages'
import EditorialResults from '../../components/EditorialResults'
import SEARCH_PAGE_CONFIG from './config'
import { EDITORIAL_TYPES } from '../EditorialOverviewPage/constants'
import DataSearchResults from './DataSearchResults'
import DatasetSearchResults from './DatasetSearchResults'
import SearchHeading from '../../components/SearchHeading/SearchHeading'
import LoadMoreButton from '../../components/LoadMoreButton/LoadMoreButton'

const StyledHeading = styled(Heading)`
  margin-bottom: ${themeSpacing(18)};
`

const ResultItem = styled.div`
  margin-bottom: ${themeSpacing(18)};
  width: inherit;
`

const getResultsComponent = (page, props) => {
  switch (page) {
    case PAGES.SPECIAL_SEARCH:
    case PAGES.PUBLICATION_SEARCH:
    case PAGES.ARTICLE_SEARCH:
      return <EditorialResults type={EDITORIAL_TYPES[page]} {...{ ...props }} />
    case PAGES.DATA_SEARCH:
      return <DataSearchResults {...{ ...props }} />
    case PAGES.DATASET_SEARCH:
      return <DatasetSearchResults {...{ ...props }} />
    default:
      return null
  }
}

const ResultColumn = styled(Column)`
  flex-direction: column;
  justify-content: flex-start;
`

const SearchPageResults = ({
  error,
  fetching,
  totalCount,
  results,
  currentPage,
  hasMore,
  fetchMore,
}) => {
  const hasResults = !fetching && !!results.length

  const Results = () =>
    currentPage === PAGES.SEARCH
      ? results.length > 0 &&
        results.map(
          ({
            type: resultItemType,
            results: resultItemResults,
            totalCount: resultItemTotalCount,
          }) =>
            resultItemTotalCount > 0 ? (
              <ResultItem>
                <SearchHeading
                  label={`${SEARCH_PAGE_CONFIG[resultItemType].label} (${resultItemTotalCount})`}
                />
                {getResultsComponent(resultItemType, {
                  results: resultItemResults,
                  loading: fetching,
                  compact: true, // Results in the search overview page are compact
                })}
              </ResultItem>
            ) : (
              ''
            ),
        )
      : getResultsComponent(currentPage, { results, loading: fetching })

  const onLoadMore = () => {
    fetchMore()
  }

  return (
    <ResultColumn
      wrap
      span={{ small: 12, medium: 12, big: 12, large: 7, xLarge: 8 }}
      push={{ small: 0, medium: 0, big: 0, large: 1, xLarge: 1 }}
    >
      {/* Todo: improve error message */}
      {error && (
        <Panel isPanelVisible type="warning">
          Er is een fout opgetreden
        </Panel>
      )}
      {fetching && <LoadingIndicator style={{ position: 'inherit' }} />}
      {hasResults && (
        <>
          <StyledHeading>
            {totalCount > 0
              ? `Alle resultaten met categorie \`${SEARCH_PAGE_CONFIG[currentPage].label}\` (${totalCount} resultaten)`
              : 'Geen resultaten'}
          </StyledHeading>
          <Results />
          {hasMore && <LoadMoreButton {...{ fetching }} onClick={onLoadMore} />}
        </>
      )}
    </ResultColumn>
  )
}

export default memo(SearchPageResults)
