import { createSelector } from 'reselect';
import {
  panoramaOrientationType,
  panoramaPersonType
} from '../../map/components/leaflet/services/icons.constant';
import { REDUCER_KEY } from './constants';

export const getPanorama = (state) => state[REDUCER_KEY] || {};
export const getPanoramaLocation = createSelector(
  getPanorama,
  (panorama) => (
    panorama ? panorama.location : []
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

export const getPanoramaPitch = getStateOfKey('pitch');
export const getReference = getStateOfKey('reference');
export const getPanoramaHistory = getStateOfKey('history');
