import { getRoute, routing } from '../../../routes'
import buildParamQuery from '../../../utils/buildParamQuery'
import { detailUrlParam } from '../query-params'

/**
 * Todo: currentPage check (and building the url via getRoute) can be removed as soon as the legacy map is removed from the codebase
 * @param urlPart
 */
const buildDetailUrl = (urlPart: string) => {
  return window.location.pathname === '/kaart'
    ? `?${buildParamQuery(detailUrlParam, urlPart).toString()}`
    : getRoute(routing.dataDetail.path, ...urlPart.split('/'))
}

export default buildDetailUrl
