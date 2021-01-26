import { all, call, put, select, takeLatest } from 'redux-saga/effects'
import { closeMapPanel, mapClear, toggleMapOverlay } from '../../map/ducks/map/actions'
import { getMapCenter } from '../../map/ducks/map/selectors'
import { getViewMode, ViewMode } from '../../shared/ducks/ui/ui'
import { ForbiddenError } from '../../shared/services/api/customError'
import PARAMETERS from '../../store/parameters'
import { toPanorama } from '../../store/redux-first-router/actions'
import { getLocationPayload } from '../../store/redux-first-router/selectors'
import { fetchPanoramaError, fetchPanoramaRequest, fetchPanoramaSuccess } from '../ducks/actions'
import {
  FETCH_PANORAMA_HOTSPOT_REQUEST,
  FETCH_PANORAMA_REQUEST,
  initialState,
  SET_PANORAMA_LOCATION,
  SET_PANORAMA_TAGS,
} from '../ducks/constants'
import { getLabelObjectByTags, getPanoramaLocation, getPanoramaTags } from '../ducks/selectors'
import { getImageDataById, getImageDataByLocation } from '../services/panorama-api/panorama-api'

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
    if (!(error instanceof ForbiddenError)) {
      yield put(fetchPanoramaError(error))
    }
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
