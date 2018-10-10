import { createSelector } from 'reselect';

import {
  getStraatbeeldLocation,
  getStraatbeeldMarkers
} from '../../../shared/ducks/straatbeeld/straatbeeld';
import {
  getClusterMarkers as getDataSelectionClusterMarkers,
  getDataSelection,
  getGeoJsons as getDataSelectionGeoJsons,
  getMarkers as getDataSelectionMarkers
} from '../data-selection/data-selection';
import { detailSelector, getGeoJson as getDetailGeoJson } from '../detail/map-detail';
import { geoSearchType } from '../../components/leaflet/services/icons.constant';
import { getMapResultsByLocation } from '../search-results/map-search-results';

export const getMap = (state) => state.map;
export const getActiveBaseLayer = createSelector(getMap, (mapState) => mapState.baseLayer);
export const getMapZoom = createSelector(getMap, (mapState) => mapState.zoom);

export const getMapOverlays = createSelector(getMap, (mapState) => mapState.overlays || []);

export const getMapCenter = createSelector(getMap, (mapState) => mapState && mapState.viewCenter);

export const getCenter = createSelector([getMapCenter, getStraatbeeldLocation],
  (mapCenter, straatbeeldLocation) => (
    straatbeeldLocation || mapCenter
  ));

export const getClusterMarkers = getDataSelectionClusterMarkers;
export const getGeoJsons = getDataSelectionGeoJsons;
export const getRdGeoJsons = createSelector(getDetailGeoJson, (geoJson) => [geoJson]);

// Selected location
export const getSelectedLocationString = (state) => state.map.selectedLocation;

export const getSelectedLocation = createSelector(
  getSelectedLocationString,
  (location) => (
    (location) ? {
      lat: parseFloat(location.split(',')[0]),
      lng: parseFloat(location.split(',')[1])
    } : null
  ));

export const getShortSelectedLocation = createSelector(
  getSelectedLocation,
  (selectedLocation) => (
    (selectedLocation) ? ({
      latitude: +parseFloat(selectedLocation.lat).toFixed(7),
      longitude: +parseFloat(selectedLocation.lng).toFixed(7)
    }) : null
  ));

export const getLocationId = createSelector(
  getShortSelectedLocation,
  (shortSelectedLocation) => (
    (shortSelectedLocation) ?
      `${shortSelectedLocation.latitude},${shortSelectedLocation.longitude}` :
      null
  ));

export const selectLatestMapSearchResults = createSelector(
  getLocationId,
  getMapResultsByLocation,
  (locationString, mapResultsByLocation) => mapResultsByLocation[locationString]
);

export const getSearchMarker = createSelector(
  getShortSelectedLocation,
  (location) =>
    ((location) ? [{ position: [location.latitude, location.longitude], type: geoSearchType }] : [])
);

export const getMarkers = createSelector(
  getDataSelection,
  getDataSelectionMarkers,
  getSearchMarker,
  getStraatbeeldMarkers,
  (dataSelectionActive, dataSelectionMarkers, searchMarkers, straatbeeldMarkers) => (
    dataSelectionActive ? dataSelectionMarkers : [...searchMarkers, ...straatbeeldMarkers]
  ));

export const isMarkerActive = createSelector([detailSelector], (detail) => !detail);
