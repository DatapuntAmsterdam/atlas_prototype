import type { Link, PaginatedData } from '../../../../map/types/details'
import { fetchWithToken } from '../../../../shared/services/api/api'

interface ApiLinkObject {
  self: {
    href: string
  }
}

interface ApiPaginateLinkObject extends ApiLinkObject {
  next?: {
    href?: string
  }
  previous?: {
    href?: string
  }
}

interface BouwblokkenResolvedResult {
  count: number
  results: Array<{ dataset: string; id: string; _display: string; _links: ApiLinkObject }>
  _links: ApiPaginateLinkObject
}

const getListFromApi =
  (defaultUrl?: string | null, normalize?: (data: any[]) => any[] | Promise<any>) =>
  async (url?: string, pageSize = 10): Promise<PaginatedData<Link[]>> => {
    const emptyResult = {
      data: [],
      count: 0,
      previous: null,
      next: null,
    }
    const fetchUrl = url ?? defaultUrl
    if (!fetchUrl) {
      return emptyResult
    }
    const endpoint = new URL(fetchUrl)
    endpoint.searchParams.set('page_size', pageSize.toString())
    const response = await fetchWithToken<BouwblokkenResolvedResult>(endpoint.toString())

    if (!response) {
      return emptyResult
    }

    // @ts-ignore
    // eslint-disable-next-line no-underscore-dangle
    const apiResponse = response._embedded ? response : response.results ?? [response]

    // @ts-ignore
    const results = normalize ? await normalize(apiResponse) : apiResponse

    return {
      data: results,
      // @ts-ignore
      count: response?.page?.totalElements ?? response.count,
      // eslint-disable-next-line no-underscore-dangle
      previous: response._links?.previous?.href || null,
      // eslint-disable-next-line no-underscore-dangle
      next: response._links?.next?.href || null,
    }
  }

export default getListFromApi
