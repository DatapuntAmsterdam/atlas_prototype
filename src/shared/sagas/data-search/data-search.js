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
  FETCH_MAP_SEARCH_RESULTS_REQUEST,
  FETCH_QUERY_SEARCH_MORE_RESULTS_REQUEST,
  SET_GEO_LOCATION,
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
  loadMore as vanillaLoadMore,
  replaceBuurtcombinatie,
  search as vanillaSearch
} from '../../services/search/search';
import { toDataSearchLocation } from '../../../store/redux-first-router/actions';
import { isDataSearch, isMapActive, isMapPage } from '../../../store/redux-first-router/selectors';
import { getMapZoom } from '../../../map/ducks/map/map-selectors';
import ActiveOverlaysClass from '../../services/active-overlays/active-overlays';
import { waitForAuthentication } from '../user/user';
import { SELECTION_TYPE, setSelection } from '../../ducks/selection/selection';

// Todo: DP-6390
export function* fetchMapSearchResults() {
  const zoom = yield select(getMapZoom);
  const isMap = yield select(isMapPage);
  const mapActive = yield select(isMapActive);
  const isDataSearchPage = yield select(isDataSearch);
  const location = yield select(getDataSearchLocation);
  try {
    yield put(setSelection(SELECTION_TYPE.POINT));
    yield call(waitForAuthentication);
    const user = yield select(getUser);

    if (!isDataSearchPage) { // User is not on a search page so go to data-search page
      if (mapActive) {
        const mapSearchResults = yield call(search, location, user);
        yield put(fetchMapSearchResultsSuccessPanel(mapSearchResults));
      } else {
        yield put(toDataSearchLocation(location));
      }
    } else if (isMap) { // if user is on the map page, fetch request for map-panel
      const mapSearchResults = yield call(search, location, user);
      yield put(fetchMapSearchResultsSuccessPanel(mapSearchResults));
    } else { // user is on data-search page
      const geoSearchResults = yield call(geosearch, location, user);
      const results = replaceBuurtcombinatie(geoSearchResults);
      yield put(fetchMapSearchResultsSuccessList(results, getNrOfSearchResults(geoSearchResults)));
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

export function* fireSearchResultsRequest() {
  const location = yield select(getDataSearchLocation);
  const query = yield select(getSearchQuery);
  const category = yield select(getSearchCategory);
  const isMap = yield select(isMapPage);

  if (location) {
    yield put(fetchMapSearchResultsRequest(location, isMap));
  } else if (query) {
    yield call(fetchQuerySearchResults, query, category);
  }
}

function* loadMore() {
  const storedResults = yield select(getSearchQueryResults);
  const results = yield vanillaLoadMore(storedResults[0]);
  yield put(fetchMoreResultsSuccess([results]));
}

export default function* watchDataSearch() {
  yield takeLatest([
    FETCH_MAP_SEARCH_RESULTS_REQUEST
  ], fetchMapSearchResults);

  yield takeLatest([
    FETCH_QUERY_SEARCH_MORE_RESULTS_REQUEST
  ], loadMore);

  yield takeLatest([
    SET_GEO_LOCATION,
    SET_QUERY_CATEGORY,
    routing.map.type,
    routing.dataSearch.type,
    routing.searchDatasets.type,
    routing.dataSearchCategory.type
  ], fireSearchResultsRequest);
}
