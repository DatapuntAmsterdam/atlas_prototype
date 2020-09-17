// Selectors
import { get } from 'lodash'
import { createSelector } from 'reselect'
import { detailPointType } from '../../../map/ducks/map/constants'
import { REDUCER_KEY } from './constants'

export const getDataSelection = (state) => state[REDUCER_KEY]
export const getDataSelectionPage = createSelector(
  getDataSelection,
  (dataSelection) => dataSelection.page,
)

export const getGeometryFilter = createSelector(
  getDataSelection,
  (dataSelection) => dataSelection.geometryFilter,
)
export const getGeometryFiltersMarkers = createSelector(
  getGeometryFilter,
  (filters) => (filters && filters.markers) || [],
)

export const getDataset = createSelector(getDataSelection, (dataSelection) => dataSelection.dataset)

export const getDataSelectionResult = createSelector(
  getDataSelection,
  (dataSelection) => dataSelection.result || {},
)
const generateMarkers = (markers) =>
  markers.map((markerLocation, index) => ({
    position: markerLocation,
    type: detailPointType,
    index,
  }))
const getMapMarkers = createSelector(
  [getDataSelection],
  (dataSelection) => dataSelection.markers || [],
)

export const getClusterMarkers = createSelector([getMapMarkers], (markers) =>
  markers && markers.clusterMarkers && markers.clusterMarkers.length
    ? generateMarkers(markers.clusterMarkers)
    : [],
)

export const getBrkMarkers = createSelector([getMapMarkers], (markers) =>
  markers && markers.markers && markers.markers.length ? markers.markers : [],
)
export const getGeoJsons = createSelector([getMapMarkers], (markers) =>
  markers && markers.geoJsons && markers.geoJsons.length ? markers.geoJsons : [],
)

export const getShapeFilter = createSelector(getDataSelection, (dataSelection) => {
  const markers = get(dataSelection, 'geometryFilter.markers')
  const description = get(dataSelection, 'geometryFilter.description')
  return markers && description
    ? {
        shape: {
          slug: 'shape',
          label: 'Locatie',
          option: `ingetekend (${description})`,
        },
      }
    : {}
})

export const getFilters = createSelector(getDataSelectionResult, (result) => result.filters || [])
export const getGeomarkersShape = createSelector(getGeometryFiltersMarkers, (markers) =>
  JSON.stringify(markers.map(([lat, lng]) => [lng, lat])),
)
export const areMarkersLoading = createSelector(
  getDataSelection,
  (dataSelection) => dataSelection.loadingMarkers,
)
