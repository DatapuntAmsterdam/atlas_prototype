import { LocationDescriptorObject } from 'history'
import { generatePath } from 'react-router-dom'
import isIgnoredPath from '../../../../store/middleware/isIgnoredPath'
import { routing } from '../../../routes'

export interface BuildDetailUrlParams {
  type: string
  subtype: string
  id: string
}

export default function buildDetailUrl({
  type,
  subtype,
  id,
}: BuildDetailUrlParams): LocationDescriptorObject {
  // TODO: AfterBeta: this statement can be removed
  const path = window.location.pathname
  const route = isIgnoredPath(path) ? routing.dataDetail_TEMP.path : routing.dataDetail.path

  return {
    pathname: generatePath(route, { type, subtype, id }),
    search: window.location.search,
  }
}
