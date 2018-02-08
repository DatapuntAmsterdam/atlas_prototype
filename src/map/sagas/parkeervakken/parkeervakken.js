import { call, put, takeLatest } from 'redux-saga/effects';
import { selectParkeervakByLatLng } from '../../services/parkeervakken/parkeervakken';
import {
  fetchParkeervakkenSuccess,
  fetchParkeervakkenError,
  fetchParkeervakkenGeolocation,
  FETCH_PARKEERVAKKEN,
  FETCH_PARKEERVAKKEN_SUCCESS
} from '../../ducks/parkeervakken/parkeervakken';

function* fetchParkeervakken(action) {
  try {
    const parkeervakken = yield call(selectParkeervakByLatLng, action.payload);
    yield put(fetchParkeervakkenSuccess(parkeervakken));
  } catch (error) {
    yield put(fetchParkeervakkenError(error));
  }
}

export default function* watchFetchParkeervakken() {
  yield takeLatest(FETCH_PARKEERVAKKEN, fetchParkeervakken);
}

function* fetchParkeervakkenGeo() {
  yield put(fetchParkeervakkenGeolocation());
}

export function* watchFetchParkeervakkenSuccess() {
  yield takeLatest(FETCH_PARKEERVAKKEN_SUCCESS, fetchParkeervakkenGeo);
}
