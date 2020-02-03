import React, { memo } from 'react'
import { FilterOption } from '@datapunt/asc-ui'
import RouterLink from 'redux-first-router-link'
import { useQuery } from 'urql'
import FilterBox from '../FilterBox'
import { routing } from '../../routes'
import SEARCH_PAGE_CONFIG from '../../pages/SearchPage/config'
import isDefined from '../../../shared/services/is-defined'
import PARAMETERS from '../../../store/parameters'
import { categoryFilterBoxQuery } from '../../pages/SearchPage/graphql.config'
import { DEFAULT_LOCALE } from '../../../shared/config/locale.config'

const ACTIVE_LINK_PROPS = { active: true, as: 'div' }

export default memo(({ currentPage, query }) => {
  const [{ data }] = useQuery({
    query: categoryFilterBoxQuery,
    variables: {
      q: query,
    },
  })

  const QUERY_PARAMETER = { [PARAMETERS.QUERY]: query }

  // We only want to preserve certain parameters when navigating between "filters" (pages)
  const RESET_ROUTE_ARGUMENTS = [QUERY_PARAMETER, undefined, undefined, false]

  const AVAILABLE_FILTERS = [
    routing.search.page,
    routing.dataSearch.page,
    routing.datasetSearch.page,
    routing.publicationSearch.page,
    routing.articleSearch.page,
    routing.specialSearch.page,
  ]

  let totalCount

  const FILTERS = AVAILABLE_FILTERS.map(filterPage => {
    let count

    if (data) {
      const filterPageData = data[SEARCH_PAGE_CONFIG[filterPage].resolver]

      if (filterPageData) {
        try {
          count = filterPageData.totalCount
          totalCount = (totalCount || 0) + count
        } catch (e) {
          // Todo: error handling
          // eslint-disable-next-line no-console
          console.warn(e)
        }
      }
    }

    return {
      ...SEARCH_PAGE_CONFIG[filterPage],
      page: filterPage,
      title: `Zoekresultaten voor ${SEARCH_PAGE_CONFIG[filterPage].label}`,
      to: SEARCH_PAGE_CONFIG[filterPage].to(...RESET_ROUTE_ARGUMENTS),
      count,
    }
  })

  return (
    <FilterBox label="Categorieën">
      {FILTERS.map(({ page, to, title, count }) => (
        <FilterOption
          key={page}
          {...(currentPage === page ? ACTIVE_LINK_PROPS : { as: RouterLink, to, title })}
        >
          {SEARCH_PAGE_CONFIG[page].label}{' '}
          {page === routing.search.page
            ? isDefined(totalCount) && `(${totalCount.toLocaleString(DEFAULT_LOCALE)})`
            : isDefined(count) && `(${count.toLocaleString(DEFAULT_LOCALE)})`}
        </FilterOption>
      ))}
    </FilterBox>
  )
})
