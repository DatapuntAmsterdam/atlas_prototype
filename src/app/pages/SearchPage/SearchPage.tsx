import { Container, Row } from '@amsterdam/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import { clearAllBodyScrollLocks, enableBodyScroll } from 'body-scroll-lock'
import { memo, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import ContentContainer from '../../components/ContentContainer/ContentContainer'
import { isAllResultsPage, isDataSearchPage, isMapSearchPage } from '../../pages'
import useCompare from '../../utils/useCompare'
import useCurrentPage from '../../utils/useCurrentPage'
import useDocumentTitle from '../../utils/useDocumentTitle'
import useParam from '../../utils/useParam'
import SEARCH_PAGE_CONFIG, { DEFAULT_LIMIT } from './config'
import { searchQueryParam } from './query-params'
import { ActiveFilter, getActiveFilters, getPage, getSort } from './SearchPageDucks'
import SearchPageFilters from './SearchPageFilters'
import SearchPageResults from './SearchPageResults'
import usePagination from './usePagination'

function getSortIntput(sortString: string) {
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
  const sort = useSelector(getSort)
  const page = useSelector(getPage)
  const activeFilters = useSelector(getActiveFilters)

  const currentPage = useCurrentPage()

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
    SEARCH_PAGE_CONFIG[currentPage]?.query,
    {
      q: query,
      page: withPagination ? page : null, // In case the pagination doesn't gets deleted when changing routes
      sort: getSortIntput(sort || defaultSort),
      limit: !withPagination ? DEFAULT_LIMIT : null,
      withPagination, // Without this no PageInfo will be returned, so the CompactPager won't be rendered
      filters: activeFilters,
    },
    SEARCH_PAGE_CONFIG[currentPage]?.resolver,
  )

  const currentPageHasChanged = useCompare(currentPage)

  // Enable / disable body lock when opening the filter on mobile
  useEffect(() => {
    const action = showFilter || currentPageHasChanged ? clearAllBodyScrollLocks : enableBodyScroll
    action(document.body)
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
            hasQuery={hasQuery}
            query={query}
            errors={errors}
            loading={initialLoading}
            totalCount={totalCount}
            results={results}
            currentPage={currentPage}
            isOverviewPage={isAllResultsPage(currentPage)}
            sort={sort}
            page={page}
            setShowFilter={setShowFilter}
            pageInfo={pageInfo}
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
function isPaginatable(currentPage: string, activeFilters: ActiveFilter[]) {
  // The data and map search pages can only be paginated if a subset of data is selected.
  if (isDataSearchPage(currentPage) || isMapSearchPage(currentPage)) {
    return activeFilters.length > 0
  }

  // Every other page can be paginated, besides the 'all results' page, since it has mixed content.
  return !isAllResultsPage(currentPage)
}

export default memo(SearchPage)
