import { call, put, takeLatest } from 'redux-saga/effects';
import { selectParkeervakByLatLng } from '../../services/parkeervakken/parkeervakken';
import {
  fetchParkeervakkenSuccess,
  fetchParkeervakkenError,
  FETCH_PARKEERVAKKEN
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
