import { FilterOption } from '@datapunt/asc-ui'
import React, { memo } from 'react'
import RouterLink from 'redux-first-router-link'
import { useQuery } from 'urql'
import isDefined from '../../../shared/services/is-defined'
import PARAMETERS from '../../../store/parameters'
import SEARCH_PAGE_CONFIG from '../../pages/SearchPage/config'
import { totalCountSearch } from '../../pages/SearchPage/documents.graphql'
import { routing } from '../../routes'
import formatCount from '../../utils/formatCount'
import FilterBox from '../FilterBox'

const ACTIVE_LINK_PROPS = { active: true, as: 'div' }

export default memo(({ currentPage, query }) => {
  const [{ data }] = useQuery({
    query: totalCountSearch,
    variables: {
      q: query,
    },
  })

  const QUERY_PARAMETER = { [PARAMETERS.QUERY]: query }

  // We only want to preserve certain parameters when navigating between "filters" (pages)
  const RESET_ROUTE_ARGUMENTS = [QUERY_PARAMETER, undefined, undefined, false]

  const AVAILABLE_FILTERS = Object.keys(SEARCH_PAGE_CONFIG)

  let totalCount

  const FILTERS = AVAILABLE_FILTERS.map((filterPage) => {
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
            ? isDefined(totalCount) && `(${formatCount(totalCount)})`
            : isDefined(count) && `(${formatCount(count)})`}
        </FilterOption>
      ))}
    </FilterBox>
  )
})
