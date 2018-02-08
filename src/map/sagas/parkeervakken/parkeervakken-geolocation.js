import { call, put, takeLatest, select } from 'redux-saga/effects';
import { getSelectedParkeervakkenGeoselection } from '../../services/parkeervakken/parkeervakken';
import {
  fetchParkeervakkenGeolocationSuccess,
  fetchParkeervakkenGeolocationError,
  FETCH_PARKEERVAKKEN_GEOLOCATION
} from '../../ducks/parkeervakken/parkeervakken';

export const getSelected = (state) => state.parkeervakken.selected;

function* fetchParkeervakkenGeoselection() {
  try {
    const selectedParkeervakken = yield select(getSelected);
    const geoselection = yield call(getSelectedParkeervakkenGeoselection, selectedParkeervakken.join(','));
    yield put(fetchParkeervakkenGeolocationSuccess(geoselection));
  } catch (error) {
    yield put(fetchParkeervakkenGeolocationError(error));
  }
}

export default function* watchFetchParkeervakkenGeolocation() {
  yield takeLatest(FETCH_PARKEERVAKKEN_GEOLOCATION, fetchParkeervakkenGeoselection);
}
