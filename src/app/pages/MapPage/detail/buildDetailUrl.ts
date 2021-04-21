import { LocationDescriptorObject } from 'history'
import { DataDetailParams, toDataDetail } from '../../../links'

export default function buildDetailUrl({
  type,
  subtype,
  id,
}: DataDetailParams): LocationDescriptorObject {
  return {
    ...toDataDetail({ type, subtype, id }),
    search: window.location.search,
  }
}
