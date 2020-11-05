import { Link, PaginatedData } from '../../../../map/types/details'
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

const getListFromApi = (
  defaultUrl?: string | null,
  normalize?: (data: any[]) => any[] | Promise<any>,
) => async (url?: string, pageSize = 10): Promise<PaginatedData<Link[]>> => {
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

  const results = normalize
    ? await normalize(response.results || [response])
    : response.results || [response]

  return {
    data: results,
    count: response.count,
    previous: response._links?.previous?.href || null,
    next: response._links?.next?.href || null,
  }
}

export default getListFromApi
