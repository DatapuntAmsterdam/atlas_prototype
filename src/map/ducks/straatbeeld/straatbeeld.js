import { createSelector } from 'reselect';

import {
  straatbeeldPersonType,
  straatbeeldOrientationType
} from '../../components/leaflet/services/icons.constant';

export const FETCH_STRAATBEELD_BY_ID = 'FETCH_STRAATBEELD_BY_ID';

export const getStraatbeeld = (state) => state.straatbeeld;

export const getStraatbeeldLocation = createSelector(getStraatbeeld,
  (straatbeeld) => (
    straatbeeld ? straatbeeld.location : ''
  ));

export const getStraatbeeldHeading = createSelector(getStraatbeeld,
  (straatbeeld) => (
    straatbeeld ? straatbeeld.heading : ''
  ));

export const getStraatbeeldMarkers = createSelector([getStraatbeeldLocation, getStraatbeeldHeading],
  (location, heading) => (
    location ? [
      {
        position: location,
        type: straatbeeldOrientationType,
        heading: heading || 0
      },
      {
        position: location,
        type: straatbeeldPersonType
      }
    ] : []
  )
);

// src/reducers/deprecated/straatbeeld-reducers.js
export const fetchStraatbeeldById = (pano) => ({
  type: FETCH_STRAATBEELD_BY_ID,
  payload: { id: pano.id, heading: pano.heading }
});
