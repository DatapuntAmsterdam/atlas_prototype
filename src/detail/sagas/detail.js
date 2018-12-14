import { put, select, takeLatest } from 'redux-saga/effects';
import { routing } from '../../app/routes';
import { fetchDetail as fetchDetailActionCreator } from '../../shared/ducks/detail/actions';
import { pageTypeToEndpoint } from '../../store/redux-first-router';
import { getDetail } from '../../shared/ducks/detail/selectors';

/* istanbul ignore next */ // TODO: refactor, test
export function* fetchDetail() {
  const { type, subtype, id } = yield select(getDetail);
  const endpoint = pageTypeToEndpoint(type, subtype, id);
  const fetchAction = fetchDetailActionCreator(endpoint);
  yield put(fetchAction);
}

/* istanbul ignore next */ // TODO: refactor, test
export function* watchDetailRoute() {
  yield takeLatest([
    routing.dataDetail.type
  ], fetchDetail);
}
