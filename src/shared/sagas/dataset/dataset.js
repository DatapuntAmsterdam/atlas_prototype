import { call, put, select, takeLatest } from 'redux-saga/effects';
import { routing } from '../../../app/routes';
import { query } from '../../services/data-selection/data-selection-api';
import { ADD_FILTER, EMPTY_FILTERS, getFilters, REMOVE_FILTER } from '../../ducks/filters/filters';
import {
  DEFAULT_DATASET,
  DEFAULT_VIEW,
  FETCH_DATASETS_REQUEST,
  fetchDatasets,
  initialState,
  receiveDatasetsFailure,
  receiveDatasetsSuccess,
  fetchSearchResultsByQuery,
  SET_PAGE
} from '../../ducks/datasets/data/data';
import {
  FETCH_API_SPECIFICATION_REQUEST,
  FETCH_API_SPECIFICATION_SUCCESS,
  fetchApiSpecification,
  fetchApiSpecificationFailure,
  fetchApiSpecificationSuccess
} from '../../ducks/datasets/apiSpecification/apiSpecification';
import { getDatasetApiSpecification, getPage } from '../../ducks/datasets/datasets';
import getApiSpecification from '../../services/datasets-filters/datasets-filters';
import { isDatasetPage } from '../../../store/redux-first-router';

function* retrieveDataset(action) {
  const { activeFilters, page, searchText, geometryFilter, catalogFilters } =
    action.payload;
  try {
    const result = yield call(query,
      DEFAULT_DATASET,
      DEFAULT_VIEW,
      activeFilters,
      page,
      searchText,
      geometryFilter,
      catalogFilters
    );

    // Put the results in the reducer
    yield put(receiveDatasetsSuccess({ activeFilters, page, geometryFilter, result }));
  } catch (e) {
    yield put(receiveDatasetsFailure({
      error: e.message
    }));
  }
}

function* fireRequest(action) {
  const state = yield select();

  // Always ensure we are on the right page, otherwise this can be called unintentionally
  if (isDatasetPage(state)) {
    const activeFilters = getFilters(state);
    const catalogFilters = getDatasetApiSpecification(state);
    const page = getPage(state);

    // Todo: make it possible to fetch both api specification and dataset data simultaneously
    // This can be done by refactoring the datasets-filters service
    if (!getDatasetApiSpecification(state)) {
      yield put(fetchApiSpecification());
    } else {
      yield put(
        fetchDatasets({
          activeFilters,
          page: action.type === ADD_FILTER ? initialState.page : page,
          catalogFilters
        })
      );
    }
  }
}

export function* retrieveApiSpecification() {
  try {
    const data = yield call(getApiSpecification);
    yield put(fetchApiSpecificationSuccess(data));
  } catch (error) {
    yield put(fetchApiSpecificationFailure(error));
  }
}

export function* fireFetchSearchResultsByQuery() {
  if (query) {
    yield put(fetchSearchResultsByQuery(query));
  }
}

export default function* watchFetchDatasets() {
  yield takeLatest(
    [ADD_FILTER, REMOVE_FILTER, EMPTY_FILTERS, FETCH_API_SPECIFICATION_SUCCESS, SET_PAGE,
      routing.datasets.type,
      routing.datasetsDetail.type
    ],
    fireRequest
  );

  yield takeLatest(FETCH_API_SPECIFICATION_REQUEST, retrieveApiSpecification);
  yield takeLatest(FETCH_DATASETS_REQUEST, retrieveDataset);

  yield takeLatest(routing.searchDatasets.type, fireFetchSearchResultsByQuery);
}

// Todo: keep until search is implemented
// export function* fetchCatalogData(action) {
//   const urlQuery = get(action, 'meta.query', {});
//   if (query.filter_theme) {
//     yield put(addFilter, {
//       groups: urlQuery.filter_theme
//     });
//   }
// }
//
// export function* watchCatalogList() {
//   yield takeLatest([
//     routing.searchDatasets.type
//   ], fetchCatalogData);
// }
