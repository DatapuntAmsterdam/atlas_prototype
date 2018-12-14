import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { routing } from '../../../app/routes';
import {
  FETCH_PANORAMA_REQUEST,
  fetchPanoramaRequest,
  getPanoramaId,
  getPanoramaLocation,
  getPanoramaYear,
  fetchPanoramaSuccess,
  fetchPanoramaError,
  CLOSE_PANORAMA,
  SET_PANORAMA_YEAR
} from '../../ducks/panorama/panorama';
import { toggleMapOverlayPanorama } from '../../../map/ducks/map/map';
import {
  getImageDataById,
  getImageDataByLocation
} from '../../services/panorama-api/panorama-api';
import { toMap } from '../../../store/redux-first-router';

export function* fireFetchPanormaRequest(action) {
  yield put(fetchPanoramaRequest(action.payload.id));
}

export function* watchPanoramaRoute() {
  yield takeLatest(routing.panorama.type, fireFetchPanormaRequest);
}

export function* fetchPanorama() {
  const [id, year = ''] = yield all([
    select(getPanoramaId),
    select(getPanoramaYear)
  ]);

  try {
    const imageData = yield call(getImageDataById, id, year);
    yield put(fetchPanoramaSuccess(imageData));
    yield put(toggleMapOverlayPanorama(year));
  } catch (error) {
    yield put(fetchPanoramaError(error));
  }
}

export function* fetchPanoramaYear() {
  const [location, year] = yield all([
    select(getPanoramaLocation),
    select(getPanoramaYear)
  ]);

  try {
    const imageData = yield call(getImageDataByLocation, location, year);
    yield put(fetchPanoramaSuccess(imageData));
    yield put(toggleMapOverlayPanorama(year));
  } catch (error) {
    yield put(fetchPanoramaError(error));
  }
}

export function* watchFetchPanorama() {
  yield all([
    takeLatest(FETCH_PANORAMA_REQUEST, fetchPanorama),
    takeLatest(SET_PANORAMA_YEAR, fetchPanoramaYear)
  ]);
}

export function* doClosePanorama() {
  yield put(toMap());
}

export function* watchClosePanorama() {
  yield takeLatest(CLOSE_PANORAMA, doClosePanorama);
}
