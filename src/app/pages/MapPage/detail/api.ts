import { fetchWithToken } from '../../../../shared/services/api/api'
import { BouwblokkenResolvedResult, Link, PaginatedData } from '../../../../map/types/details'
import { getDetailPageData } from '../../../../store/redux-first-router/actions'

// eslint-disable-next-line import/prefer-default-export
export const getListFromApi = (result: any, defaultUrl: string) => async (
  url?: string,
  pageSize: number = 10,
): Promise<PaginatedData<Link[]> | null> => {
  const endpoint = url || defaultUrl
  const newEndpoint = new URL(endpoint)
  newEndpoint.searchParams.set('page_size', pageSize.toString())
  const res = await fetchWithToken<BouwblokkenResolvedResult>(newEndpoint.href)

  return res
    ? {
        data: res.results.map(({ _display, _links }) => {
          const { type, subtype, id } = getDetailPageData(_links.self.href)
          return {
            to: `${type}/${subtype}/${id}`,
            title: _display,
          }
        }),
        count: res.count,
        previous: res._links.previous.href || null,
        next: res._links.next.href || null,
      }
    : null
}
