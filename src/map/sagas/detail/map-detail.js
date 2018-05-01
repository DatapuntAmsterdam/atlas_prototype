import { call, put, takeLatest } from 'redux-saga/effects';

import fetchDetail from '../../services/map-detail';

export function* fetchMapDetail(action) {
  try {
    const mapDetail = yield call(fetchDetail, action.endpoint, action.user);
    yield put({
      type: 'FETCH_MAP_DETAIL_SUCCESS',
      endpoint: action.endpoint,
      mapDetail: mapDetail || {}
    });
  } catch (error) {
    yield put({ type: 'FETCH_MAP_DETAIL_FAILURE', error });
  }
}

export default function* watchFetchMapDetail() {
  yield takeLatest('FETCH_MAP_DETAIL_REQUEST', fetchMapDetail);
}
