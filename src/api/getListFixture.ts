import type { APIReference } from './types'
import environment from '../environment'

const getListResultFixture = (
  results: APIReference[],
  selfHref: string,
  count = 0,
  nextHref: string | null = null,
  prevHref: string | null = null,
) => {
  return {
    _links: {
      self: {
        href: selfHref,
      },
      next: {
        href: nextHref,
      },
      previous: {
        href: prevHref,
      },
    },
    count,
    results,
  }
}

const getListFixture = (
  result: APIReference,
  path: string,
  count: number,
  nextHref?: string,
  prevHref?: string,
) => {
  const selfHref = `${environment.API_ROOT}${path}`
  return {
    listNoResults: getListResultFixture([result], selfHref),
    listResult: getListResultFixture([result], selfHref, 1),
    listResultPagination: getListResultFixture(
      Array(count).fill(result),
      selfHref,
      count,
      nextHref,
      prevHref,
    ),
  }
}

export default getListFixture
