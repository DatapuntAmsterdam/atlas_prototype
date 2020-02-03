import React, { memo, useEffect, useState } from 'react'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import { clearAllBodyScrollLocks, enableBodyScroll } from 'body-scroll-lock'
import {
  breakpoint,
  Column,
  Container,
  Row,
  Modal,
  themeSpacing,
  TopBar,
  Button,
  Heading,
  Spinner,
  styles,
} from '@datapunt/asc-ui'
import styled, { css } from '@datapunt/asc-core'
import { Close } from '@datapunt/asc-assets'
import ContentContainer from '../../components/ContentContainer/ContentContainer'
import PageFilterBox from '../../components/PageFilterBox/PageFilterBox'
import SEARCH_PAGE_CONFIG, {
  DEFAULT_LIMIT,
  DATA_SEARCH_PAGES,
  DATASET_SEARCH_PAGES,
  EDITORIAL_SEARCH_PAGES,
} from './config'
import SearchPageResults from './SearchPageResults'
import usePagination from '../../utils/usePagination'
import SearchPageFilters from './SearchPageFilters'
import useCompare from '../../utils/useCompare'
import useSelectors from '../../utils/useSelectors'
import { getActiveFilters, getSort } from './SearchPageDucks'
import useDocumentTitle from '../../utils/useDocumentTitle'

const FilterColumn = styled(Column)`
  align-content: flex-start;

  @media screen and ${breakpoint('max-width', 'laptop')} {
    display: none;
  }
`

const FILTER_BOX_WIDTH_CSS = css`
  @media screen and ${breakpoint('min-width', 'mobileL')} {
    width: calc(100% - ${themeSpacing(10)});
    max-width: calc(400px + ${themeSpacing(12)});
  }
`

const StyledModal = styled(Modal)`
  ${FILTER_BOX_WIDTH_CSS}

  ${FilterColumn} {
    top: 0;
    width: 100%;
    position: relative;
    display: block;
    overflow-y: auto;
    left: 0;
    right: ${themeSpacing(5)};
    flex-grow: 1;
    margin-bottom: ${themeSpacing(19)};

    @media screen and ${breakpoint('max-width', 'mobileL')} {
      ${styles.FilterBoxStyle} {
        border-right: transparent;
        border-left: transparent;
      }
    }
    @media screen and ${breakpoint('min-width', 'mobileL')} {
      padding-left: ${themeSpacing(5)};
      padding-right: ${themeSpacing(5)};
    }
  }

  [role='dialog'] {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    position: relative;
    height: 100vh;
    max-height: 100%;
    max-width: initial;
    top: 0;
    left: 0;
    bottom: 0;
    pointer-events: all;
    transform: initial;
  }
`

const ModalCloseButton = styled(Button)`
  margin-left: auto;
`

const ApplyFilters = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 30; // Todo: implement better z-index strategy
  width: 100%;
  display: flex;
  justify-content: center;
  padding: ${themeSpacing(4)};
  background-color: #fff;
  box-shadow: 0 0 ${themeSpacing(2)} 1px black;
  margin-top: auto;

  ${FILTER_BOX_WIDTH_CSS}
`

const ApplyFiltersButton = styled(Button)`
  width: 100%;
  display: flex;
  text-align: center;
  justify-content: center;
`

/* TODO: Write tests for the Hooks used in this component */
/* istanbul ignore next */
const SearchPage = ({ isOverviewPage, currentPage, query }) => {
  const [extraQuery, setExtraQuery] = useState({})
  const [showLoadMore, setShowLoadMore] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [sort, activeFilters] = useSelectors([getSort, getActiveFilters])
  const from = 0
  const defaultSort = isOverviewPage ? 'date:desc' : ''

  const { documentTitle } = useDocumentTitle()
  const { trackPageView } = useMatomo()

  useEffect(() => {
    if (documentTitle) {
      trackPageView({ documentTitle })
    }
  }, [documentTitle])

  const {
    fetching,
    errors,
    totalCount,
    fetchingMore,
    results,
    filters,
    fetchMore,
    hasMore,
  } = usePagination(
    SEARCH_PAGE_CONFIG[currentPage],
    {
      q: query,
      limit: DEFAULT_LIMIT,
      ...extraQuery,
    },
    sort || defaultSort,
    DEFAULT_LIMIT,
    from,
  )

  const currentPageHasChanged = useCompare(currentPage)

  // Close the filterbox when changing the page
  useEffect(() => {
    if (currentPageHasChanged) {
      setShowFilter(false)
    }
  }, [currentPage])

  // Enable / disable body lock when opening the filter on mobile
  useEffect(() => {
    const action = showFilter || currentPageHasChanged ? clearAllBodyScrollLocks : enableBodyScroll
    action()
  }, [showFilter, currentPage])

  useEffect(() => {
    const isSearchPage = [
      ...EDITORIAL_SEARCH_PAGES,
      ...DATASET_SEARCH_PAGES,
      ...DATA_SEARCH_PAGES,
    ].includes(currentPage)

    if (isSearchPage) {
      setShowLoadMore(true)
      setExtraQuery({ filters: activeFilters })
    } else {
      setExtraQuery({})
      setShowLoadMore(false)
    }
  }, [currentPage, activeFilters])

  const Filters = (
    <FilterColumn wrap span={{ small: 0, medium: 0, big: 0, large: 4, xLarge: 3 }}>
      {!isOverviewPage && <PageFilterBox {...{ query, currentPage }} />}
      <SearchPageFilters filters={filters} totalCount={totalCount} />
    </FilterColumn>
  )

  return (
    <Container>
      <ContentContainer>
        <Row>
          {!showFilter && Filters}
          <StyledModal
            aria-labelledby="filters"
            aria-describedby="filters"
            open={showFilter}
            onClose={() => setShowFilter(false)}
            hideOverFlow={false}
            zIndexOffset={1}
          >
            <TopBar>
              <Heading style={{ flexGrow: 1 }} as="h4">
                <ModalCloseButton
                  variant="blank"
                  type="button"
                  size={30}
                  onClick={() => setShowFilter(false)}
                  icon={<Close />}
                />
              </Heading>
            </TopBar>
            {Filters}
            <ApplyFilters>
              <ApplyFiltersButton
                iconLeft={fetching && <Spinner />}
                onClick={() => setShowFilter(false)}
                variant="primary"
              >
                {!fetching && `${totalCount} resultaten tonen`}
              </ApplyFiltersButton>
            </ApplyFilters>
          </StyledModal>
          <SearchPageResults
            {...{
              query,
              errors,
              fetching,
              totalCount,
              results,
              currentPage,
              isOverviewPage,
              hasMore,
              fetchingMore,
              fetchMore,
              showLoadMore,
              sort,
              setShowFilter,
            }}
          />
        </Row>
      </ContentContainer>
    </Container>
  )
}

export default memo(SearchPage)
