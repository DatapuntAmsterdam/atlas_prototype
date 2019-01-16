import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { routing } from '../../app/routes';
import {
  fetchPanoramaError,
  fetchPanoramaRequest,
  fetchPanoramaSuccess
} from '../../panorama/ducks/actions';
import {
  CLOSE_PANORAMA,
  FETCH_PANORAMA_HOTSPOT_REQUEST,
  FETCH_PANORAMA_REQUEST,
  FETCH_PANORAMA_REQUEST_TOGGLE,
  SET_PANORAMA_LOCATION,
  SET_PANORAMA_YEAR
} from '../../panorama/ducks/constants';
import { getPanoramaHistory, getPanoramaLocation } from '../../panorama/ducks/selectors';
import { toggleMapOverlayPanorama } from '../../map/ducks/map/map';
import { getImageDataById, getImageDataByLocation } from '../services/panorama-api/panorama-api';
import { toMap, toPanorama } from '../../store/redux-first-router/actions';
import { getLocationPayload } from '../../store/redux-first-router/selectors';

export function* fireFetchPanormaRequest(action) {
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

export function* doClosePanorama() {
  yield put(toMap());
}

export function* watchPanoramaRoute() {
  yield takeLatest(routing.panorama.type, fireFetchPanormaRequest);
}

export function* watchClosePanorama() {
  yield takeLatest(CLOSE_PANORAMA, doClosePanorama);
}
