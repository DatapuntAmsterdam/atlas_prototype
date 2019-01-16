import { call, put, select, takeLatest } from 'redux-saga/effects';
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
import { routing } from '../../../app/routes';
import {
  FETCH_GEO_SEARCH_RESULTS_REQUEST,
  FETCH_QUERY_SEARCH_MORE_RESULTS_REQUEST,
  SET_QUERY_CATEGORY,
  SET_VIEW,
  VIEWS
} from '../../ducks/data-search/constants';
import {
  getDataSearchLocation,
  getSearchCategory,
  getSearchQuery,
  getSearchQueryResults,
  getView
} from '../../ducks/data-search/selectors';
import {
  getNumberOfResults as getNrOfSearchResults, getNumberOfResultsPanel,
  loadMore as vanillaLoadMore,
  replaceBuurtcombinatie,
  search as vanillaSearch
} from '../../services/search/search';
import { isMapPage } from '../../../store/redux-first-router/selectors';
import { getMapZoom } from '../../../map/ducks/map/map-selectors';
import ActiveOverlaysClass from '../../services/active-overlays/active-overlays';
import { waitForAuthentication } from '../user/user';
import { SELECTION_TYPE, setSelection } from '../../ducks/selection/selection';

// Todo: DP-6390
export function* fetchMapSearchResults() {
  const zoom = yield select(getMapZoom);
  const view = yield select(getView);
  const location = yield select(getDataSearchLocation);
  try {
    yield put(setSelection(SELECTION_TYPE.POINT));
    yield call(waitForAuthentication);
    const user = yield select(getUser);

    if (view === VIEWS.LIST) {
      const geoSearchResults = yield call(geosearch, location, user);
      const results = replaceBuurtcombinatie(geoSearchResults);
      yield put(fetchMapSearchResultsSuccessList(results, getNrOfSearchResults(geoSearchResults)));
    } else {
      const mapSearchResults = yield call(search, location, user);
      yield put(fetchMapSearchResultsSuccessPanel(
        mapSearchResults,
        getNumberOfResultsPanel(mapSearchResults)
      ));
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
  const isQuery = isString(query);
  if (isQuery) {
    if (isString(category) && category.length) {
      const results = yield vanillaSearch(query, category, user);
      yield call(setSearchResults, results);
    } else {
      const results = yield vanillaSearch(query, undefined, user);
      yield call(setSearchResults, results);
    }
  }
}

export function* fireGeoSearchResultsRequest() {
  const location = yield select(getDataSearchLocation);
  const isMap = yield select(isMapPage);
  yield put(fetchMapSearchResultsRequest(location, isMap));
}

export function* fireQuerySearchResultsRequest() {
  const query = yield select(getSearchQuery);
  const category = yield select(getSearchCategory);
  yield call(fetchQuerySearchResults, query, category);
}

function* loadMore() {
  const storedResults = yield select(getSearchQueryResults);
  const results = yield vanillaLoadMore(storedResults[0]);
  yield put(fetchMoreResultsSuccess([results]));
}

export default function* watchDataSearch() {
  yield takeLatest([
    FETCH_GEO_SEARCH_RESULTS_REQUEST
  ], fetchMapSearchResults);

  yield takeLatest([
    FETCH_QUERY_SEARCH_MORE_RESULTS_REQUEST
  ], loadMore);

  yield takeLatest([
    SET_VIEW,
    routing.dataGeoSearch.type
  ], fireGeoSearchResultsRequest);

  yield takeLatest([
    SET_QUERY_CATEGORY,
    routing.dataQuerySearch.type,
    routing.searchDatasets.type,
    routing.dataSearchCategory.type
  ], fireQuerySearchResultsRequest);
}
