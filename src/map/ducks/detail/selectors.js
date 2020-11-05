import { createSelector } from 'reselect'
import {
  getDetailDisplay,
  getDetailEndpoint,
  getDetailGeometry,
} from '../../../shared/ducks/detail/selectors'
import { isDataDetailPage, isPanoPage } from '../../../store/redux-first-router/selectors'

const shouldShowGeoJson = () => isDataDetailPage || isPanoPage

export const mapDetailSelector = (state) => state.mapDetail

export const getCurrentEndpoint = createSelector(
  mapDetailSelector,
  (mapDetail) => mapDetail.currentEndpoint,
)

export const getAllResults = createSelector(mapDetailSelector, (mapDetail) => mapDetail.byEndpoint)

export const selectLatestMapDetail = createSelector(
  [getCurrentEndpoint, getAllResults],
  (currentEndpoint, byEndpoint) => currentEndpoint && byEndpoint && byEndpoint[currentEndpoint],
)

export const getMapDetailGeometry = createSelector(
  selectLatestMapDetail,
  (activeMapDetail) => activeMapDetail && activeMapDetail.geometrie,
)

export const getDetailId = createSelector(
  getDetailEndpoint,
  getCurrentEndpoint,
  (detailEndpoint, currentEndpoint) => detailEndpoint || currentEndpoint,
)

export const getGeometry = createSelector(getDetailGeometry, (detailGeometry) => detailGeometry)

export const getGeoJson = createSelector(
  shouldShowGeoJson,
  getGeometry,
  getDetailDisplay,
  getDetailId,
  (isGeoJsonActive, geometry, detailDisplay, detailId) =>
    isGeoJsonActive && geometry
      ? {
          id: detailId,
          geoJson: {
            geometry: geometry || '',
            label: detailDisplay || '',
          },
        }
      : {},
)
