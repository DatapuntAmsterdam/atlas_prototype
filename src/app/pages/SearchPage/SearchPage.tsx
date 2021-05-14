import { Container, Row } from '@amsterdam/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import { clearAllBodyScrollLocks, enableBodyScroll } from 'body-scroll-lock'
import { useEffect, useState } from 'react'
import ContentContainer from '../../components/ContentContainer/ContentContainer'
import { isAllResultsPage, isDataSearchPage, isMapSearchPage } from '../../pages'
import useCompare from '../../utils/useCompare'
import useCurrentPage from '../../utils/useCurrentPage'
import useDocumentTitle from '../../utils/useDocumentTitle'
import useParam from '../../utils/useParam'
import SEARCH_PAGE_CONFIG, { DEFAULT_LIMIT } from './config'
import {
  ActiveFilter,
  activeFiltersParam,
  pageParam,
  queryParam,
  Sort,
  SortOrder,
  sortParam,
} from './query-params'
import SearchPageFilters from './SearchPageFilters'
import SearchPageResults from './SearchPageResults'
import usePagination from './usePagination'

const SearchPage = () => {
  const [activeFilters] = useParam(activeFiltersParam)
  const [page] = useParam(pageParam)
  const [query] = useParam(queryParam)
  const [sort] = useParam(sortParam)
  const [initialLoading, setInitialLoading] = useState(true)
  const [showFilter, setShowFilter] = useState(false)
  const currentPage = useCurrentPage()

  const hasQuery = query.trim().length > 0
  const defaultSort: Sort | null = !hasQuery ? { field: 'date', order: SortOrder.Descending } : null
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
      sort: sort ?? defaultSort,
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

export default SearchPage
