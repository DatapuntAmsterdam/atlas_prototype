import { call, put, select, takeLatest } from 'redux-saga/effects';
import search from '../../../map/services/map-search/map-search';
import { getUser } from '../../../shared/ducks/user/user';
import {
  FETCH_MAP_SEARCH_RESULTS_REQUEST,
  fetchMapSearchResultsFailure,
  fetchMapSearchResultsRequest,
  fetchMapSearchResultsSuccess,
  fetchSearchResultsByQuery,
  getDataSearchLocation,
  getSearchQuery
} from '../../ducks/data-search/data-search';
import { routing } from '../../../app/routes';

export function* fetchMapSearchResults() {
  const user = yield select(getUser);
  const location = yield select(getDataSearchLocation);
  try {
    const mapSearchResults = yield call(search, location, user);
    yield put(fetchMapSearchResultsSuccess(mapSearchResults));
  } catch (error) {
    yield put(fetchMapSearchResultsFailure(error));
  }
}

export function* fireMapSearchResultsRequest() {
  const location = yield select(getDataSearchLocation);
  if (location) {
    yield put(fetchMapSearchResultsRequest(location));
  }
}

export function* fireFetchSearchResultsByQuery() {
  const query = yield select(getSearchQuery);
  if (query) {
    yield put(fetchSearchResultsByQuery(query));
  }
}

export default function* watchDataSearch() {
  yield takeLatest([
    FETCH_MAP_SEARCH_RESULTS_REQUEST
  ], fetchMapSearchResults);

  yield takeLatest([
    routing.map.type,
    routing.dataSearch.type
  ], fireMapSearchResultsRequest);

  yield takeLatest(routing.dataSearch.type, fireFetchSearchResultsByQuery);
}
