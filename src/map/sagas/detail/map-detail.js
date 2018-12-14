import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
  fetchMapDetailSuccess,
  fetchMapDetailFailure,
  getCurrentEndpoint,
  getMapDetail
} from '../../ducks/detail/map-detail';

import fetchDetail from '../../services/map-detail';
import { getDetailEndpoint } from '../../../shared/ducks/detail/selectors';
import { routing } from '../../../app/routes';
import { FETCH_MAP_DETAIL_REQUEST } from '../../ducks/detail/constants';
import { getUser } from '../../../shared/ducks/user/user';
import { waitForAuthentication } from '../../../shared/sagas/user/user';

export function* fetchMapDetail() {
  try {
    yield call(waitForAuthentication);
    const user = yield select(getUser);
    const endpoint = yield select(getCurrentEndpoint);
    const mapDetail = yield call(fetchDetail, endpoint, user);
    yield put(fetchMapDetailSuccess(endpoint, mapDetail || {}));
  } catch (error) {
    yield put(fetchMapDetailFailure);
  }
}

function* fireFetchMapDetail() {
  const endpoint = yield select(getDetailEndpoint);
  yield put(getMapDetail(endpoint));
}

export default function* watchMapDetail() {
  yield takeLatest(FETCH_MAP_DETAIL_REQUEST, fetchMapDetail);

  yield takeLatest([
    routing.dataDetail.type
  ], fireFetchMapDetail);
}
