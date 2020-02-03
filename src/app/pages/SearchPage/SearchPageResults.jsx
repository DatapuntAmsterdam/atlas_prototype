import React, { memo, useMemo } from 'react'
import styled from '@datapunt/asc-core'
import {
  breakpoint,
  Button,
  Column,
  Heading,
  themeSpacing,
  Divider,
  themeColor,
} from '@datapunt/asc-ui'
import { Enlarge } from '@datapunt/asc-assets'
import PAGES from '../../pages'
import SEARCH_PAGE_CONFIG, { EDITORIAL_SEARCH_PAGES } from './config'
import ActionButton from '../../components/ActionButton/ActionButton'
import SearchResults, { SearchResultsSkeleton } from './SearchResultsComponent'
import SearchResultsOverview, { SearchResultsOverviewSkeleton } from './SearchResults'
import SearchSort from './SearchSort'
import { DEFAULT_LOCALE } from '../../../shared/config/locale.config'

const StyledHeading = styled(Heading)`
  margin-bottom: ${themeSpacing(4)};
  @media screen and ${breakpoint('min-width', 'tabletM')} {
    margin-bottom: ${themeSpacing(12)};
  }
`

const ResultWrapper = styled.div`
  @media screen and ${breakpoint('max-width', 'laptop')} {
    margin-top: ${themeSpacing(4)};
  }
  width: inherit;
`

const FilterButton = styled(Button)`
  align-self: flex-start;
  margin-bottom: ${themeSpacing(4)};
  display: block;
  flex-grow: 1;

  @media screen and ${breakpoint('max-width', 'mobileL')} {
    width: 100%;
    text-align: center;
  }
  @media screen and ${breakpoint('min-width', 'tabletS')} {
    max-width: 160px;
  }
  @media screen and ${breakpoint('min-width', 'laptop')} {
    display: none;
  }
`

const ResultColumn = styled(Column)`
  flex-direction: column;
  justify-content: flex-start;
`

const StyledDivider = styled(Divider)`
  height: 2px;
  width: 100%;
  background-color: ${themeColor('tint', 'level3')};
  margin-bottom: ${themeSpacing(5)};
`

const FilterWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-right: ${themeSpacing(4)};
`

const SearchPageResults = ({
  query,
  errors,
  fetching,
  totalCount,
  results,
  currentPage,
  isOverviewPage,
  hasMore,
  fetchMore,
  fetchingMore,
  showLoadMore,
  setShowFilter,
  sort,
}) => {
  // we need to memoize this until the results have been changed (prevents flashing no results content because fetching is set before results)
  const [initialLoading, doneLoading] = useMemo(
    () => [fetching && !fetchingMore, !fetching && !fetchingMore],
    [results],
  )

  const allResultsPageActive = currentPage === PAGES.SEARCH

  const formatTitle = (label, count = null) => {
    if (count === 0) {
      return `Geen resultaten met '${query}'`
    }

    if (count === null) {
      return isOverviewPage ? label : `${label} met '${query}'`
    }

    const countFormatted = count.toLocaleString(DEFAULT_LOCALE)

    return isOverviewPage
      ? `${label} (${countFormatted})`
      : `${label} met '${query}' (${countFormatted} resultaten)`
  }

  return (
    <ResultColumn
      wrap
      span={{ small: 12, medium: 12, big: 12, large: 7, xLarge: 8 }}
      push={{ small: 0, medium: 0, big: 0, large: 1, xLarge: 1 }}
    >
      <StyledHeading>
        {doneLoading
          ? formatTitle(SEARCH_PAGE_CONFIG[currentPage].label, totalCount)
          : formatTitle(SEARCH_PAGE_CONFIG[currentPage].label)}
      </StyledHeading>
      <FilterWrapper>
        <FilterButton variant="primary" onClick={() => setShowFilter(true)} disabled={!doneLoading}>
          Filteren
        </FilterButton>
        {EDITORIAL_SEARCH_PAGES.includes(currentPage) && (
          <SearchSort isOverviewPage={isOverviewPage} sort={sort} disabled={!doneLoading} />
        )}
        {EDITORIAL_SEARCH_PAGES.includes(currentPage) && <StyledDivider />}
      </FilterWrapper>
      {initialLoading && (
        <ResultWrapper>
          {allResultsPageActive ? <SearchResultsOverviewSkeleton /> : <SearchResultsSkeleton />}
        </ResultWrapper>
      )}
      {doneLoading && (
        <ResultWrapper>
          {allResultsPageActive ? (
            <SearchResultsOverview {...{ query, totalCount, results, errors, loading: fetching }} />
          ) : (
            <SearchResults
              {...{
                page: currentPage,
                query,
                results,
                errors,
                loading: fetching,
                showLoadMore,
                isOverviewPage,
              }}
            />
          )}
          {showLoadMore && hasMore && (
            <ActionButton
              label="Toon meer"
              iconLeft={<Enlarge />}
              {...{ fetching: fetchingMore, onClick: fetchMore }}
            />
          )}
        </ResultWrapper>
      )}
    </ResultColumn>
  )
}

export default memo(SearchPageResults)
