import { useQuery } from 'urql'
import type { DocumentNode, GraphQLFormattedError } from 'graphql'
import type { ErrorExtensions } from '../../models/graphql'
import type { ActiveFilter } from './SearchPageDucks'

interface Variables {
  q: string
  page: number | null
  sort?: { field: string; order: string }
  limit: number | null
  withPagination: boolean
  filters: ActiveFilter[]
}

const usePagination = (query: DocumentNode, variables: Variables, resolver: string | string[]) => {
  const [result] = useQuery({
    query,
    variables,
  })

  const { fetching, error, data } = result || {}

  let {
    totalCount,
    filters = [],
    results = [],
    // eslint-disable-next-line prefer-const
    pageInfo = null,
  }: any = data && !Array.isArray(resolver) && data[resolver] ? data[resolver] : {}

  if (data && Array.isArray(resolver)) {
    const allCounts: number[] = resolver.map((key) => data[key] && data[key].totalCount)

    totalCount = allCounts.reduce((acc, cur) => acc + cur)
    filters = data.filters ? data.filters : []
    results = resolver.map((key) => {
      const { results: dataResults = [], totalCount: dataTotalCount } = data[key] || {}

      return { key, results: dataResults, totalCount: dataTotalCount, filters: [] }
    })
  }

  const errors: GraphQLFormattedError<ErrorExtensions>[] = (error?.graphQLErrors ?? []).map(
    (graphQlError) => {
      // Only include extensions that actually contain fields.
      const extensions =
        graphQlError.extensions !== undefined && Object.keys(graphQlError.extensions).length > 0
          ? (graphQlError.extensions as ErrorExtensions)
          : undefined

      return {
        message: graphQlError.message,
        locations: graphQlError.locations,
        path: graphQlError.path,
        extensions,
      }
    },
  )

  return { fetching, errors, totalCount, filters, results, pageInfo }
}

export default usePagination
