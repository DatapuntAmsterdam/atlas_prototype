import { FilterOption } from '@amsterdam/asc-ui'
import { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'urql'
import PARAMETERS from '../../../store/parameters'
import SEARCH_PAGE_CONFIG from '../../pages/SearchPage/config'
// @ts-ignore
import { totalCountSearch } from '../../pages/SearchPage/documents.graphql'
import { routing } from '../../routes'
import formatCount from '../../utils/formatCount'
import FilterBox from '../FilterBox'

const ACTIVE_LINK_PROPS = { active: true, as: 'div' }

interface PageFilterBoxProps {
  currentPage: string
  query: string
}

const PageFilterBox: FunctionComponent<PageFilterBoxProps> = ({ currentPage, query }) => {
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

  let totalCount: number

  const FILTERS = AVAILABLE_FILTERS.map((filterPage) => {
    let count

    if (data) {
      // @ts-ignore
      const filterPageData = data[SEARCH_PAGE_CONFIG[filterPage].resolver]

      if (filterPageData) {
        try {
          count = filterPageData.totalCount as number
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
      <ul>
        {FILTERS.map(({ page, path, title, count }) => (
          <li key={page}>
            <FilterOption
              {...(currentPage === page
                ? ACTIVE_LINK_PROPS
                : {
                    as: Link,
                    to: { pathname: path, search: query ? `?term=${query}` : '' },
                    title,
                  })}
            >
              {SEARCH_PAGE_CONFIG[page].label}{' '}
              {page === routing.search.page
                ? totalCount !== undefined && `(${formatCount(totalCount)})`
                : count !== undefined && `(${formatCount(count)})`}
            </FilterOption>
          </li>
        ))}
      </ul>
    </FilterBox>
  )
}

export default PageFilterBox
