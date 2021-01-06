import { APIReference } from './types'

const getListResultFixture = (
  results: APIReference[],
  selfHref: string,
  count: number = 0,
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
  selfHref: string,
  count: number,
  nextHref: string,
  prevHref: string,
) => ({
  listNoResults: getListResultFixture([result], selfHref),
  listResult: getListResultFixture([result], selfHref, 1),
  listResultPagination: getListResultFixture(
    Array(count).fill(result),
    selfHref,
    count,
    nextHref,
    prevHref,
  ),
})

export default getListFixture
