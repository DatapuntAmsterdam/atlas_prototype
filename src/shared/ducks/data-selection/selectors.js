// Selectors
import get from 'lodash.get';
import { createSelector } from 'reselect';
import { REDUCER_KEY, VIEWS } from './constants';
import { detailPointType } from '../../../map/components/leaflet/services/icons.constant';

export const getDataSelection = (state) => state[REDUCER_KEY];
export const getDataSelectionPage = createSelector(
  getDataSelection,
  (dataSelection) => dataSelection.page);

export const getGeometryFilters = createSelector(
  getDataSelection,
  (dataSelection) => dataSelection.geometryFilter);
export const getGeometryFiltersMarkers = createSelector(
  getGeometryFilters,
  (filters) => (filters && filters.markers) || []);
export const getDataSelectionResult = createSelector(
  getDataSelection,
  (dataSelection) => dataSelection.result || {});
export const getDataSelectionView = createSelector(
  getDataSelection,
  (dataSelection) => dataSelection && dataSelection.view
);
export const isListView = createSelector(
  getDataSelectionView,
  (view) => view === VIEWS.LIST
);
const generateMarkers = (markers) => (
  markers.map((markerLocation, index) => ({
    position: markerLocation,
    type: detailPointType,
    index
  })));
const getMapMarkers = createSelector([getDataSelection],
  (dataSelection) => dataSelection.markers || []);
export const getClusterMarkers = createSelector([getMapMarkers],
  (markers) => (
    markers && markers.clusterMarkers && markers.clusterMarkers.length ?
      generateMarkers(markers.clusterMarkers) : []
  ));
export const getGeoJsons = createSelector([getMapMarkers],
  (markers) => (
    markers && markers.geoJsons && markers.geoJsons.length ?
      markers.geoJsons : []
  ));
export const getFilters = createSelector(
  getDataSelectionResult, (result) => result.filters || []
);
export const getGeomarkersShape = createSelector(
  getGeometryFiltersMarkers,
  (markers) => JSON.stringify(
    markers.map(([lat, lng]) => [lng, lat])
  )
);
export const hasGeometryFilter = createSelector(
  getDataSelection,
  (dataSelection) => !!get(dataSelection, 'geometryFilter.markers', false)
);

export const getNumberOfDrawMarkers = createSelector(
  getDataSelection,
  (dataSelection) => get(dataSelection, 'geometryFilter.markers', []).length
);
