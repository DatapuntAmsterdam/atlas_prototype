import { Link, PaginatedData } from '../../../../map/types/details'
import { fetchWithToken } from '../../../../shared/services/api/api'
import { getDetailPageData } from '../../../../store/redux-first-router/actions'
import buildDetailUrl from './buildDetailUrl'

interface ApiLinkObject {
  self: {
    href: string
  }
}

interface ApiPaginateLinkObject extends ApiLinkObject {
  next: {
    href?: string
  }
  previous: {
    href?: string
  }
}

interface BouwblokkenResolvedResult {
  count: number
  results: Array<{ dataset: string; id: string; _display: string; _links: ApiLinkObject }>
  _links: ApiPaginateLinkObject
}

// eslint-disable-next-line import/prefer-default-export
export const getListFromApi = (defaultUrl: string) => async (
  url?: string,
  pageSize = 10,
): Promise<PaginatedData<Link[]> | null> => {
  const endpoint = new URL(url ?? defaultUrl)
  endpoint.searchParams.set('page_size', pageSize.toString())
  const response = await fetchWithToken<BouwblokkenResolvedResult>(endpoint.toString())

  if (!response) {
    return null
  }

  return {
    data: response.results.map(({ _display, _links }) => ({
      to: buildDetailUrl(getDetailPageData(_links.self.href)),
      title: _display,
    })),
    count: response.count,
    previous: response._links.previous.href || null,
    next: response._links.next.href || null,
  }
}
