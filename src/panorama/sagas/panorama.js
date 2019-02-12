import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import {
  fetchPanoramaError,
  fetchPanoramaRequest,
  fetchPanoramaSuccess
} from '../../panorama/ducks/actions';
import {
  getDetailReference,
  getPageReference,
  getPanoramaHistory,
  getPanoramaLocation
} from '../../panorama/ducks/selectors';
import { closeMapPanel, toggleMapOverlayPanorama } from '../../map/ducks/map/map';
import { getImageDataById, getImageDataByLocation } from '../services/panorama-api/panorama-api';
import { toDataDetail, toGeoSearch, toPanorama } from '../../store/redux-first-router/actions';
import { getLocationPayload } from '../../store/redux-first-router/selectors';
import { getViewMode, VIEW_MODE } from '../../shared/ducks/ui/ui';
import PARAMETERS from '../../store/parameters';
import { getMapOverlays } from '../../map/ducks/map/map-selectors';
import {
  CLOSE_PANORAMA,
  FETCH_PANORAMA_HOTSPOT_REQUEST,
  FETCH_PANORAMA_REQUEST,
  FETCH_PANORAMA_REQUEST_TOGGLE,
  PAGE_REF_MAPPING,
  SET_PANORAMA_LOCATION,
  SET_PANORAMA_YEAR
} from '../ducks/constants';

export function* fetchFetchPanoramaEffect(action) {
  const view = yield select(getViewMode);
  if (view === VIEW_MODE.FULL || view === VIEW_MODE.SPLIT) {
    yield put(closeMapPanel());
  }
  yield put(fetchPanoramaRequest(action.payload));
}

export function* maybeChangeRoute(id) {
  const { id: urlId } = yield select(getLocationPayload);
  if (id && (urlId !== id)) {
    yield put(toPanorama(id));
  }
}

export function* handlePanoramaRequest(fn, id, location) {
  const history = yield select(getPanoramaHistory);
  try {
    // Navigate to new panorama if the id in URL is not the same
    // We check this before we fetch the panoramaData so prevents a useless call
    yield call(maybeChangeRoute, id);

    // continue getting the panoramaData
    const panoramaData = yield call(fn, (id || location), history);

    // Again check if we need to navigate, as we know our ID now
    yield call(maybeChangeRoute, panoramaData.id);

    yield put(fetchPanoramaSuccess(panoramaData));
    yield put(toggleMapOverlayPanorama(history));
  } catch (error) {
    yield put(fetchPanoramaError(error));
  }
}

export function* fetchPanoramaById(action) {
  yield call(handlePanoramaRequest, getImageDataById, action.payload.id);
}

export function* fetchPanoramaByLocation() {
  const location = yield select(getPanoramaLocation);
  yield call(handlePanoramaRequest, getImageDataByLocation, undefined, location);
}

export function* watchFetchPanorama() {
  yield all([
    takeLatest([FETCH_PANORAMA_HOTSPOT_REQUEST, FETCH_PANORAMA_REQUEST], fetchPanoramaById),
    takeLatest([
      SET_PANORAMA_YEAR,
      SET_PANORAMA_LOCATION,
      FETCH_PANORAMA_REQUEST_TOGGLE
    ], fetchPanoramaByLocation)
  ]);
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
  const detailReference = yield select(getDetailReference);
  const pageReference = yield select(getPageReference);
  const panoramaLocation = yield select(getPanoramaLocation);
  const overlays = yield select(getMapOverlays);

  if (Array.isArray(detailReference) && detailReference.length) {
    yield put(toDataDetail(detailReference, {
      [PARAMETERS.LAYERS]: overlays,
      [PARAMETERS.VIEW]: VIEW_MODE.SPLIT
    }));
  } else if (typeof PAGE_REF_MAPPING[pageReference] === 'function') {
    yield put(PAGE_REF_MAPPING[pageReference]());
  } else {
    yield put(toGeoSearch({
      [PARAMETERS.LOCATION]: panoramaLocation,
      [PARAMETERS.VIEW]: VIEW_MODE.SPLIT,
      [PARAMETERS.LAYERS]: overlays
    }));
  }
}

export function* watchClosePanorama() {
  yield takeLatest(CLOSE_PANORAMA, doClosePanorama);
}
