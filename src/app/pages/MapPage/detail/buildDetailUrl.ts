import { getRoute, routing } from '../../../routes'
import buildParamQuery from '../../../utils/buildParamQuery'
import { detailUrlParam } from '../query-params'

/**
 * Todo: currentPage check (and building the url via getRoute) can be removed as soon as the legacy map is removed from the codebase
 * @param urlPart
 */
const buildDetailUrl = ({ type, subtype, id }: { type: string; subtype: string; id: string }) => {
  return window.location.pathname === '/kaart'
    ? `?${buildParamQuery(detailUrlParam, `${type}/${subtype}/${id}`).toString()}`
    : getRoute(routing.dataDetail.path, type, subtype, `id${id}`)
}

export default buildDetailUrl
