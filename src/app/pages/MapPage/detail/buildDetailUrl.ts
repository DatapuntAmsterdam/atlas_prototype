import { generatePath } from 'react-router-dom'
import { routing } from '../../../routes'

/**
 * @param urlPart
 */
const buildDetailUrl = ({ type, subtype, id }: { type: string; subtype: string; id: string }) => {
  // Todo: AfterBeta: this statement can be removed
  const route = window.location.pathname.includes('kaart')
    ? routing.dataDetail_TEMP.path
    : routing.dataDetail.path
  return {
    pathname: generatePath(route, { type, subtype, id }),
    search: window.location.search,
  }
}

export default buildDetailUrl
