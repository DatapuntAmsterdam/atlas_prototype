import { call, put, takeLatest } from 'redux-saga/effects';

import { getMapBaseLayers } from '../../services';
import {
  FETCH_MAP_BASE_LAYERS_SUCCESS,
  FETCH_MAP_BASE_LAYERS_FAILURE,
  FETCH_MAP_BASE_LAYERS_REQUEST
} from '../../ducks/base-layers/map-base-layers';

export function* fetchMapBaseLayers() {
  try {
    const mapBaseLayers = yield call(getMapBaseLayers);
    yield put({ type: FETCH_MAP_BASE_LAYERS_SUCCESS, mapBaseLayers });
  } catch (error) {
    yield put({ type: FETCH_MAP_BASE_LAYERS_FAILURE, error });
  }
}

export default function* watchFetchMapBaseLayers() {
  yield takeLatest(FETCH_MAP_BASE_LAYERS_REQUEST, fetchMapBaseLayers);
}
