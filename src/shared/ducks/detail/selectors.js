import { createSelector } from 'reselect'
import { REDUCER_KEY } from './constants'
import { pageTypeToEndpoint } from '../../../map/services/map-detail/map-detail'

export const getDetail = (state) => state[REDUCER_KEY]
export const getDetailGeometry = createSelector(getDetail, (detail) => detail && detail.geometry)
export const getDetailEndpoint = createSelector(getDetail, (detail) => {
  if (detail && detail.type && detail.subtype && detail.id) {
    return pageTypeToEndpoint(detail.type, detail.subtype, detail.id)
  }
  return undefined
})
export const getSubType = createSelector(getDetail, (detail) => detail.subtype)
export const getID = createSelector(getDetail, (detail) => detail.id)
export const getType = createSelector(getDetail, (detail) => detail.type)
export const getDetailDisplay = createSelector(getDetail, (detail) => detail && detail.display)
export const isDetailLoading = createSelector(getDetail, (detail) => detail && detail.isLoading)

export const getView = createSelector(getDetail, (detail) => detail && detail.view)

export const getDetailTemplateUrl = createSelector(
  getDetail,
  (detail) => detail && detail.includeSrc,
)
export const getDetailData = createSelector(getDetail, (detail) => detail && detail.data)

export const getDetailFilterSelection = createSelector(
  getDetail,
  (detail) => detail && detail.filterSelection,
)
