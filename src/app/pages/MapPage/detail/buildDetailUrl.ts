import { generatePath } from 'react-router-dom'
import { routing } from '../../../routes'
import buildParamQuery from '../../../utils/buildParamQuery'
import { detailUrlParam } from '../query-params'

/**
 * Todo: currentPage check (and building the url via getRoute) can be removed as soon as the legacy map is removed from the codebase
 * @param urlPart
 */
const buildDetailUrl = ({ type, subtype, id }: { type: string; subtype: string; id: string }) => {
  return window.location.pathname === '/kaart' || window.location.pathname === '/kaart/'
    ? {
        pathname: routing.map.path,
        search: buildParamQuery(detailUrlParam, `${type}/${subtype}/${id}`).toString(),
      }
    : {
        pathname: generatePath(routing.dataDetail.path, { type, subtype, id: `id${id}` }),
        search: window.location.search,
      }
}

export default buildDetailUrl
