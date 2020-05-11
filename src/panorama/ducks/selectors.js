import { createSelector } from 'reselect'
import { PANO_LABELS, REDUCER_KEY } from './constants'
import { panoramaOrientationType, panoramaPersonType } from '../../map/ducks/map/constants'

export const getPanorama = (state) => state[REDUCER_KEY] || {}
export const getPanoramaLocation = createSelector(getPanorama, (panorama) =>
  panorama ? panorama.location : [],
)
const getStateOfKey = (key) => (state) => createSelector(getPanorama, (data) => data[key])(state)

export const getPanoramaHeading = getStateOfKey('heading')
export const getPanoramaMarkers = createSelector(
  [getPanoramaLocation, getPanoramaHeading],
  (location, heading) =>
    location
      ? [
          {
            position: location,
            type: panoramaOrientationType,
            heading: heading || 0,
          },
          {
            position: location,
            type: panoramaPersonType,
          },
        ]
      : [],
)

export const getPanoramaPitch = getStateOfKey('pitch')
export const getDetailReference = getStateOfKey('detailReference')
export const getPageReference = getStateOfKey('pageReference')
export const getPanoramaTags = getStateOfKey('tags')

export const getLabelObjectByTags = (tags) =>
  PANO_LABELS.find((value) => JSON.stringify(value.tags.sort()) === JSON.stringify(tags)) ||
  PANO_LABELS[0]
