import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { routing } from '../../../app/routes';
import {
  fetchPanoramaError,
  fetchPanoramaRequest,
  fetchPanoramaSuccess
} from '../../ducks/panorama/actions';
import { toggleMapOverlayPanorama } from '../../../map/ducks/map/map';
import { getImageDataById, getImageDataByLocation } from '../../services/panorama-api/panorama-api';
import { toMap } from '../../../store/redux-first-router';
import {
  CLOSE_PANORAMA,
  FETCH_PANORAMA_REQUEST, SET_PANORAMA_LOCATION,
  SET_PANORAMA_YEAR
} from '../../ducks/panorama/constants';
import {
  getPanoramaId,
  getPanoramaLocation,
  getPanoramaYear
} from '../../ducks/panorama/selectors';

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

export function* fetchPanoramaByLocation() {
  const [location, year] = yield all([
    select(getPanoramaLocation),
    select(getPanoramaYear)
  ]);

  try {
    const imageData = yield call(getImageDataByLocation, location, year);
    yield put(fetchPanoramaSuccess(imageData));
    if (year) {
      yield put(toggleMapOverlayPanorama(year));
    }
  } catch (error) {
    yield put(fetchPanoramaError(error));
  }
}

export function* watchFetchPanorama() {
  yield all([
    takeLatest(FETCH_PANORAMA_REQUEST, fetchPanorama),
    takeLatest([SET_PANORAMA_YEAR, SET_PANORAMA_LOCATION], fetchPanoramaByLocation)
  ]);
}

export function* doClosePanorama() {
  yield put(toMap());
}

export function* watchClosePanorama() {
  yield takeLatest(CLOSE_PANORAMA, doClosePanorama);
}
