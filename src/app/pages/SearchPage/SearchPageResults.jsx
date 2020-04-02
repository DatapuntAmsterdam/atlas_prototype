import React, { memo } from 'react'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import {
  breakpoint,
  Button,
  Column,
  Heading,
  themeSpacing,
  Divider,
  themeColor,
  CompactPager,
} from '@datapunt/asc-ui'
import PARAMETERS from '../../../store/parameters'
import PAGES from '../../pages'
import SEARCH_PAGE_CONFIG, { EDITORIAL_SEARCH_PAGES } from './config'
import { SearchResultsSkeleton, SearchResultsOverviewSkeleton } from './SearchResultsSkeleton'
import SearchResultsOverview from './SearchResultsOverview'
import SearchSort from './SearchSort'
import { DEFAULT_LOCALE } from '../../../shared/config/locale.config'
import MaxSearchPageMessage from '../../components/PanelMessages/MaxSearchPageMessage'

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
`
const SearchResultsWrapper = styled.div`
  @media screen and ${breakpoint('min-width', 'laptop')} {
    margin-bottom: ${themeSpacing(14)};
  }

  margin-bottom: ${themeSpacing(10)};
`

const StyledErrorMessage = styled(MaxSearchPageMessage)`
  margin-bottom: ${themeSpacing(10)};
`

const StyledCompactPager = styled(CompactPager)`
  @media screen and ${breakpoint('min-width', 'laptop')} {
    width: 240px;
  }
  width: 100%;
`

const SearchPageResults = ({
  query,
  errors,
  fetching,
  totalCount,
  results,
  currentPage,
  isOverviewPage,
  setShowFilter,
  sort,
  page,
  pageInfo,
  hasQuery,
}) => {
  const dispatch = useDispatch()
  const allResultsPageActive = currentPage === PAGES.SEARCH

  const formatTitle = (label, count = null) => {
    // Handle an empty result.
    if (count === 0) {
      return hasQuery ? `Geen resultaten met '${query}'` : 'Geen resultaten'
    }

    // Handle pages without a count (usually the loading state).
    if (count === null) {
      return hasQuery ? `${label} met '${query}'` : label
    }

    const countFormatted = count.toLocaleString(DEFAULT_LOCALE)

    return `${label} ${hasQuery ? `met '${query}'` : ''} (${countFormatted} ${
      count === 1 ? 'resultaat' : 'resultaten'
    })`
  }

  const ResultsComponent =
    (SEARCH_PAGE_CONFIG[currentPage] && SEARCH_PAGE_CONFIG[currentPage].component) || null

  return (
    <ResultColumn
      wrap
      span={{ small: 12, medium: 12, big: 12, large: 7, xLarge: 8 }}
      push={{ small: 0, medium: 0, big: 0, large: 1, xLarge: 1 }}
    >
      <StyledHeading>
        {formatTitle(SEARCH_PAGE_CONFIG[currentPage].label, !fetching ? totalCount : null)}
      </StyledHeading>
      <FilterWrapper>
        <FilterButton variant="primary" onClick={() => setShowFilter(true)} disabled={fetching}>
          Filteren
        </FilterButton>
        {EDITORIAL_SEARCH_PAGES.includes(currentPage) && (
          <>
            <SearchSort isOverviewPage={isOverviewPage} sort={sort} disabled={fetching} />
            <StyledDivider />
          </>
        )}
      </FilterWrapper>
      {fetching && (
        <ResultWrapper>
          {allResultsPageActive ? <SearchResultsOverviewSkeleton /> : <SearchResultsSkeleton />}
        </ResultWrapper>
      )}
      {!fetching && (
        <ResultWrapper>
          {allResultsPageActive ? (
            <SearchResultsOverview {...{ query, totalCount, results, errors, loading: fetching }} />
          ) : (
            <SearchResultsWrapper>
              <ResultsComponent
                {...{
                  page: currentPage,
                  query,
                  results,
                  errors,
                  withPagination: pageInfo,
                  loading: fetching,
                  isOverviewPage,
                  label: SEARCH_PAGE_CONFIG[currentPage].label,
                  type: SEARCH_PAGE_CONFIG[currentPage].type,
                }}
              />
            </SearchResultsWrapper>
          )}
          {pageInfo && pageInfo.hasLimitedResults && !pageInfo.hasNextPage && (
            <StyledErrorMessage />
          )}
          {pageInfo && results.length > 0 && (
            // TODO: Check if the CompactPager component is structured correctly..
            <StyledCompactPager
              page={page}
              pageSize={Math.ceil(totalCount / pageInfo.totalPages)}
              collectionSize={totalCount}
              onPageChange={(pageNumber) => {
                dispatch(
                  SEARCH_PAGE_CONFIG[currentPage].to(
                    {
                      [PARAMETERS.PAGE]: pageNumber,
                    },
                    false,
                    true,
                  ),
                )
              }}
            />
          )}
        </ResultWrapper>
      )}
    </ResultColumn>
  )
}

export default memo(SearchPageResults)
