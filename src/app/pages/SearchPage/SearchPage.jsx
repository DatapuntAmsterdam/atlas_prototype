import { Container, Row } from '@datapunt/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import { clearAllBodyScrollLocks, enableBodyScroll } from 'body-scroll-lock'
import React, { memo, useEffect, useState } from 'react'
import { getPage as getCurrentPage } from '../../../store/redux-first-router/selectors'
import ContentContainer from '../../components/ContentContainer/ContentContainer'
import { isAllResultsPage, isDataSearchPage, isMapSearchPage } from '../../pages'
import useCompare from '../../utils/useCompare'
import useDocumentTitle from '../../utils/useDocumentTitle'
import useParam from '../../utils/useParam'
import useSelectors from '../../utils/useSelectors'
import SEARCH_PAGE_CONFIG, { DEFAULT_LIMIT } from './config'
import { searchQueryParam } from './query-params'
import { getActiveFilters, getPage, getSort } from './SearchPageDucks'
import SearchPageFilters from './SearchPageFilters'
import SearchPageResults from './SearchPageResults'
import usePagination from './usePagination'

function getSortIntput(sortString) {
  let sort
  if (sortString && sortString.length) {
    const [field, order] = sortString.split(':')
    sort = {
      field,
      order,
    }
  }
  return sort
}

/* TODO: Write tests for the Hooks used in this component */
/* istanbul ignore next */
const SearchPage = () => {
  const [initialLoading, setInitialLoading] = useState(true)
  const [showFilter, setShowFilter] = useState(false)
  const [sort, page, activeFilters, currentPage] = useSelectors([
    getSort,
    getPage,
    getActiveFilters,
    getCurrentPage,
  ])

  const [query] = useParam(searchQueryParam)
  const hasQuery = query.trim().length > 0
  const defaultSort = !hasQuery ? 'date:desc' : ''
  const withPagination = isPaginatable(currentPage, activeFilters)

  const { documentTitle } = useDocumentTitle()
  const { trackPageView } = useMatomo()

  useEffect(() => {
    if (documentTitle) {
      trackPageView({ documentTitle })
    }
  }, [documentTitle])

  const { fetching, errors, totalCount, filters, results, pageInfo } = usePagination(
    SEARCH_PAGE_CONFIG[currentPage].query,
    {
      q: query,
      page: withPagination ? page : null, // In case the pagination doesn't gets deleted when changing routes
      sort: getSortIntput(sort || defaultSort),
      limit: !withPagination ? DEFAULT_LIMIT : null,
      withPagination, // Without this no PageInfo will be returned, so the CompactPager won't be rendered
      filters: activeFilters,
    },
    SEARCH_PAGE_CONFIG[currentPage].resolver,
  )

  const currentPageHasChanged = useCompare(currentPage)

  // Enable / disable body lock when opening the filter on mobile
  useEffect(() => {
    const action = showFilter || currentPageHasChanged ? clearAllBodyScrollLocks : enableBodyScroll
    action()
  }, [showFilter, currentPage])

  // Only the initial loading state should render the skeleton components, this prevents unwanted flickering when changing query variables
  useEffect(() => {
    if (currentPageHasChanged) {
      // If the page changes, the skeleton components must be rendered, unless we already have results
      setInitialLoading(!results.length)
    } else if (!!results && !fetching) {
      setInitialLoading(false)
    }
  }, [currentPage, results, fetching])

  return (
    <Container>
      <ContentContainer>
        <Row>
          <SearchPageFilters
            filters={filters}
            totalCount={totalCount}
            hideCount={!isDataSearchPage(currentPage)}
            setShowFilter={setShowFilter}
            query={query}
            currentPage={currentPage}
            fetching={fetching}
            showFilter={showFilter}
          />

          <SearchPageResults
            {...{
              hasQuery,
              query,
              errors,
              fetching: initialLoading,
              totalCount,
              results,
              currentPage,
              isOverviewPage: isAllResultsPage(currentPage),
              sort,
              page,
              setShowFilter,
              pageInfo,
            }}
          />
        </Row>
      </ContentContainer>
    </Container>
  )
}

/**
 * Determines if a search page can be paginated or not.
 *
 * @param currentPage The currently active page.
 * @param activeFilters The currently active filter.
 */
function isPaginatable(currentPage, activeFilters) {
  // The data and map search pages can only be paginated if a subset of data is selected.
  if (isDataSearchPage(currentPage) || isMapSearchPage(currentPage)) {
    return activeFilters.length > 0
  }

  // Every other page can be paginated, besides the 'all results' page, since it has mixed content.
  return !isAllResultsPage(currentPage)
}

export default memo(SearchPage)
