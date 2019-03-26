import { call, fork, put, select, takeLatest } from 'redux-saga/effects';
import { getUser } from '../../../shared/ducks/user/user';
import search from '../../../map/services/map-search/map-search';
import geosearch from '../../../shared/services/search/geosearch';
import {
  fetchMapSearchResultsFailure,
  fetchMapSearchResultsRequest,
  fetchMapSearchResultsSuccessList,
  fetchMapSearchResultsSuccessPanel,
  fetchMoreResultsSuccess,
  showSearchResults
} from '../../ducks/data-search/actions';
import {
  FETCH_GEO_SEARCH_RESULTS_REQUEST,
  FETCH_QUERY_SEARCH_MORE_RESULTS_REQUEST,
  SET_QUERY_CATEGORY
} from '../../ducks/data-search/constants';
import {
  getDataSearchLocation,
  getSearchCategory,
  getSearchQuery,
  getSearchQueryResults
} from '../../ducks/data-search/selectors';
import {
  getNumberOfResults as getNrOfSearchResults,
  getNumberOfResultsPanel,
  loadMore as vanillaLoadMore,
  querySearch,
  replaceBuurtcombinatie
} from '../../services/search/search';
import { getPage } from '../../../store/redux-first-router/selectors';
import { getMapZoom } from '../../../map/ducks/map/selectors';
import ActiveOverlaysClass from '../../services/active-overlays/active-overlays';
import { waitForAuthentication } from '../user/user';
import { SELECTION_TYPE, setSelection } from '../../ducks/selection/selection';
import { fetchDatasetsEffect } from '../dataset/dataset';
import { getViewMode, isMapPage, SET_VIEW_MODE, VIEW_MODE } from '../../ducks/ui/ui';
import PAGES from '../../../app/pages';
import { ERROR_TYPES, setGlobalError } from '../../ducks/error/error-message';

// Todo: DP-6390
export function* fetchMapSearchResults() {
  const zoom = yield select(getMapZoom);
  const view = yield select(getViewMode);
  const location = yield select(getDataSearchLocation);
  try {
    yield put(setSelection(SELECTION_TYPE.POINT));
    yield call(waitForAuthentication);
    const user = yield select(getUser);

    if (view === VIEW_MODE.SPLIT || view === VIEW_MODE.FULL) {
      const geoSearchResults = yield call(geosearch, location, user);
      const results = replaceBuurtcombinatie(geoSearchResults);
      yield put(fetchMapSearchResultsSuccessList(results, getNrOfSearchResults(geoSearchResults)));
    } else {
      const { results, errors } = yield call(search, location, user);
      yield put(fetchMapSearchResultsSuccessPanel(
        results,
        getNumberOfResultsPanel(results)
      ));

      if (errors) {
        yield put(setGlobalError(ERROR_TYPES.GENERAL_ERROR));
      }
    }
  } catch (error) {
    const payload = ActiveOverlaysClass.getOverlaysWarning(zoom);
    yield put(fetchMapSearchResultsFailure(payload));
  }
}

function isString(value) {
  return typeof value === 'string';
}

function* setSearchResults(searchResults) {
  const numberOfResults = getNrOfSearchResults(searchResults);
  const query = yield select(getSearchQuery);
  const result = replaceBuurtcombinatie(searchResults);
  yield put(showSearchResults(result, query, numberOfResults));
}

function* fetchQuerySearchResults() {
  const query = yield select(getSearchQuery);
  const category = yield select(getSearchCategory);
  yield call(waitForAuthentication);
  const user = yield select(getUser);
  if (query) {
    const categorySlug = (isString(category) && category.length) ? category : undefined;
    const { results, errors } = yield call(querySearch, query, categorySlug, user);
    if (errors) {
      yield put(setGlobalError(ERROR_TYPES.GENERAL_ERROR));
    }
    yield call(setSearchResults, results);
  }
}

export function* fetchGeoSearchResultsEffect() {
  const location = yield select(getDataSearchLocation);
  const isMap = yield select(isMapPage);
  const page = yield select(getPage);

  if (page === PAGES.DATA_GEO_SEARCH) {
    yield put(fetchMapSearchResultsRequest(location, isMap));
  }
}

export function* fetchQuerySearchResultsEffect() {
  const query = yield select(getSearchQuery);
  const category = yield select(getSearchCategory);
  yield call(fetchQuerySearchResults, query, category);
}

function* loadMore() {
  const storedResults = yield select(getSearchQueryResults);
  const results = yield vanillaLoadMore(storedResults[0]);
  yield put(fetchMoreResultsSuccess([results]));
}

export function* fetchQuerySearchEffect() {
  yield fork(fetchQuerySearchResultsEffect);
  yield fork(fetchDatasetsEffect);
}

export default function* watchDataSearch() {
  yield takeLatest(FETCH_GEO_SEARCH_RESULTS_REQUEST, fetchMapSearchResults);
  yield takeLatest(FETCH_QUERY_SEARCH_MORE_RESULTS_REQUEST, loadMore);
  yield takeLatest(SET_VIEW_MODE, fetchGeoSearchResultsEffect);
  yield takeLatest(SET_QUERY_CATEGORY, fetchQuerySearchResultsEffect);
}
