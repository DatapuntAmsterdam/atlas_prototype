import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { routing } from '../../app/routes';
import {
  fetchPanoramaError,
  fetchPanoramaRequest,
  fetchPanoramaSuccess
} from '../../panorama/ducks/actions';
import {
  CLOSE_PANORAMA,
  FETCH_PANORAMA_REQUEST,
  FETCH_PANORAMA_REQUEST_TOGGLE,
  SET_PANORAMA_LOCATION,
  SET_PANORAMA_YEAR
} from '../../panorama/ducks/constants';
import {
  getPanoramaHistory,
  getPanoramaId,
  getPanoramaLocation
} from '../../panorama/ducks/selectors';
import { toggleMapOverlayPanorama } from '../../map/ducks/map/map';
import { getImageDataById, getImageDataByLocation } from '../services/panorama-api/panorama-api';
import { toMap } from '../../store/redux-first-router';

export function* fireFetchPanormaRequest(action) {
  yield put(fetchPanoramaRequest(action.payload));
}

export function* watchPanoramaRoute() {
  yield takeLatest(routing.panorama.type, fireFetchPanormaRequest);
}

export function* fetchPanoramaById() {
  const [id, history = {}] = yield all([
    select(getPanoramaId),
    select(getPanoramaHistory)
  ]);

  try {
    const imageData = yield call(getImageDataById, id, history);
    yield put(fetchPanoramaSuccess(imageData));
    yield put(toggleMapOverlayPanorama(history));
  } catch (error) {
    yield put(fetchPanoramaError(error));
  }
}

export function* fetchPanoramaByLocation() {
  const [location, history = {}] = yield all([
    select(getPanoramaLocation),
    select(getPanoramaHistory)
  ]);

  try {
    const imageData = yield call(getImageDataByLocation, location, history);
    yield put(fetchPanoramaSuccess(imageData));
    yield put(toggleMapOverlayPanorama(history));
  } catch (error) {
    yield put(fetchPanoramaError(error));
  }
}

export function* watchFetchPanorama() {
  yield all([
    takeLatest(FETCH_PANORAMA_REQUEST, fetchPanoramaById),
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

export function* watchClosePanorama() {
  yield takeLatest(CLOSE_PANORAMA, doClosePanorama);
}
