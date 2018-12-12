import { createSelector } from 'reselect';
import {
  panoramaOrientationType,
  panoramaPersonType
} from '../../../map/components/leaflet/services/icons.constant';
import { REDUCER_KEY } from './constants';

export const getPanorama = (state) => state[REDUCER_KEY] || {};
export const getHotspots = createSelector(getPanorama, (panorama) => {
  const { year, hotspots } = panorama;
  if (year) {
    // TODO: refactor: refire hotspots search request. Not everything is returned from back-end.
    // TODO: refactor: test hotspots are filtered by year
    return hotspots.filter((hotspot) => hotspot.year === year);
  }
  return hotspots;
});
export const getPanoramaLocation = createSelector(
  getPanorama,
  (panorama) => (
    panorama ? panorama.location : ''
  )
);
const getStateOfKey = (key) => (state) => createSelector(getPanorama, (data) => (data[key]))(state);

export const getPanoramaHeading = getStateOfKey('heading');
export const getPanoramaMarkers = createSelector([getPanoramaLocation, getPanoramaHeading],
  (location, heading) => (
    location ? [
      {
        position: location,
        type: panoramaOrientationType,
        heading: heading || 0
      },
      {
        position: location,
        type: panoramaPersonType
      }
    ] : []
  )
);

export const getPanoramaId = getStateOfKey('id');

export const getPanoramaPitch = getStateOfKey('pitch');
export const getPanoramaView = getStateOfKey('view');
export const getPanoramaYear = getStateOfKey('year');
export const getReference = getStateOfKey('reference');
