import { put, takeLatest } from 'redux-saga/effects';

import ACTIONS, { REQUEST_GEOSEARCH } from '../../../shared/actions';

export function* requestGeoSearch(action) {
  yield put({
    type: ACTIONS.MAP_CLICK,
    payload: action.payload
  });
}

export default function* watchGeoSearchRequest() {
  yield takeLatest(REQUEST_GEOSEARCH, requestGeoSearch);
}
