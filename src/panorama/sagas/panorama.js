import { all, call, put, select, takeLatest } from 'redux-saga/effects'
import { fetchPanoramaError, fetchPanoramaRequest, fetchPanoramaSuccess } from '../ducks/actions'
import {
  getDetailReference,
  getPageReference,
  getPanoramaLocation,
  getPanoramaTags,
  getLabelObjectByTags,
} from '../ducks/selectors'
import { closeMapPanel, toggleMapOverlay, mapClear } from '../../map/ducks/map/actions'
import { getImageDataById, getImageDataByLocation } from '../services/panorama-api/panorama-api'
import { toDataDetail, toGeoSearch, toPanorama } from '../../store/redux-first-router/actions'
import { getLocationPayload } from '../../store/redux-first-router/selectors'
import { getViewMode, ViewMode } from '../../shared/ducks/ui/ui'
import PARAMETERS from '../../store/parameters'
import { getMapOverlays, getMapCenter } from '../../map/ducks/map/selectors'
import {
  initialState,
  CLOSE_PANORAMA,
  FETCH_PANORAMA_HOTSPOT_REQUEST,
  FETCH_PANORAMA_REQUEST,
  PAGE_REF_MAPPING,
  SET_PANORAMA_LOCATION,
  SET_PANORAMA_TAGS,
} from '../ducks/constants'

export function* fetchFetchPanoramaEffect(action) {
  const view = yield select(getViewMode)
  if (view === ViewMode.Full || view === ViewMode.Split) {
    yield put(closeMapPanel())
  }
  yield put(fetchPanoramaRequest(action.payload))
}

export function* handlePanoramaRequest(fn, input, tags) {
  try {
    const panoramaData = yield call(fn, input, tags)
    const { id } = yield select(getLocationPayload)

    // Transform the tags to the mapLayer ID
    const { layer } = getLabelObjectByTags(tags)

    yield put(mapClear())
    yield put(toggleMapOverlay(layer))

    if (id && id !== panoramaData.id) {
      const viewCenter = yield select(getMapCenter)
      const location = yield select(getPanoramaLocation)
      const panoramaTags =
        tags !== initialState.tags ? { [PARAMETERS.PANORAMA_TAGS]: tags.join() } : {}

      const additionalParams = {
        ...panoramaTags,
        [PARAMETERS.VIEW_CENTER]: viewCenter,
        [PARAMETERS.LOCATION]: location,
      }

      yield put(toPanorama(panoramaData.id, { additionalParams }))
    }
    yield put(fetchPanoramaSuccess({ ...panoramaData, tags }))
  } catch (error) {
    yield put(fetchPanoramaError(error))
  }
}

export function* fetchPanoramaById(action) {
  const tags = yield select(getPanoramaTags)
  yield call(handlePanoramaRequest, getImageDataById, action.payload.id, tags)
}

export function* fetchPanoramaByLocation(action) {
  const tags = yield select(getPanoramaTags)
  yield call(handlePanoramaRequest, getImageDataByLocation, action.payload, tags)
}

export function* fetchPanoramaByTags(action) {
  const location = yield select(getPanoramaLocation)
  yield call(handlePanoramaRequest, getImageDataByLocation, location, action.payload)
}

export function* watchFetchPanorama() {
  yield all([
    takeLatest([FETCH_PANORAMA_HOTSPOT_REQUEST, FETCH_PANORAMA_REQUEST], fetchPanoramaById),
    takeLatest([SET_PANORAMA_LOCATION], fetchPanoramaByLocation),
    takeLatest([SET_PANORAMA_TAGS], fetchPanoramaByTags),
  ])
}

/**
 * We have two types of 'references': detail and page
 * detailReference will contain the detail id of the page, and so will navigate to one if set
 * pageReference is mapped to an action that will be dispatched if set (and so will navigate to a
 * page.
 * By default, the panorama always has a location, so if pageReference or detailReference are not
 * set, do a geosearch based on th panorama's location
 * @returns {IterableIterator<*>}
 */
export function* doClosePanorama() {
  const detailReference = yield select(getDetailReference)
  const pageReference = yield select(getPageReference)
  const panoramaLocation = yield select(getPanoramaLocation)
  let overlays = yield select(getMapOverlays)

  // Filter out the panorama layers, as they should be closed
  overlays = overlays?.filter(({ id }) => !id.startsWith('pano'))

  if (Array.isArray(detailReference) && detailReference.length) {
    yield put(
      toDataDetail(detailReference, {
        [PARAMETERS.LAYERS]: overlays,
        [PARAMETERS.VIEW]: ViewMode.Split,
      }),
    )
  } else if (typeof PAGE_REF_MAPPING[pageReference] === 'function') {
    yield put(PAGE_REF_MAPPING[pageReference]())
  } else {
    yield put(
      toGeoSearch({
        [PARAMETERS.LOCATION]: panoramaLocation,
        [PARAMETERS.VIEW]: ViewMode.Split,
        [PARAMETERS.LAYERS]: overlays,
      }),
    )
  }
}

export function* watchClosePanorama() {
  yield takeLatest(CLOSE_PANORAMA, doClosePanorama)
}
