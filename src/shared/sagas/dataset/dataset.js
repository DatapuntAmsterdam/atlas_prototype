import get from 'lodash.get';
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
  SET_PAGE
} from '../../ducks/datasets/data/data';
import {
  FETCH_API_SPECIFICATION_REQUEST,
  FETCH_API_SPECIFICATION_SUCCESS,
  fetchApiSpecification,
  fetchApiSpecificationFailure,
  fetchApiSpecificationSuccess
} from '../../ducks/datasets/apiSpecification/apiSpecification';
import { getApiSpecificationData, getPage } from '../../ducks/datasets/datasets';
import getApiSpecification from '../../services/datasets-filters/datasets-filters';
import { getSearchQuery } from '../../ducks/data-search/selectors';
import PARAMETERS from '../../../store/parameters';

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
    yield put(receiveDatasetsSuccess({ activeFilters, page, searchText, geometryFilter, result }));
  } catch (e) {
    yield put(receiveDatasetsFailure({
      error: e.message
    }));
  }
}

function* fireRequest(action) {
  const state = yield select();

  const activeFilters = getFilters(state);
  const catalogFilters = getApiSpecificationData(state);
  const page = getPage(state);
  const searchText = get(action, `meta.query[${PARAMETERS.QUERY}]`) || getSearchQuery(state);
  // Todo: make it possible to fetch both api specification and dataset data simultaneously
  // This can be done by refactoring the datasets-filters service
  if (!Object.keys(getApiSpecificationData(state) || {}).length) {
    yield put(fetchApiSpecification());
  } else if (!get(action, 'meta.skipFetch')) {
    yield put(
      fetchDatasets({
        activeFilters,
        page: action.type === ADD_FILTER ? initialState.page : page,
        catalogFilters,
        searchText
      })
    );
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

export default function* watchFetchDatasets() {
  yield takeLatest(
    [ADD_FILTER, REMOVE_FILTER, EMPTY_FILTERS, FETCH_API_SPECIFICATION_SUCCESS, SET_PAGE,
      routing.datasets.type,
      routing.datasetsDetail.type,
      routing.dataQuerySearch.type,
      routing.searchDatasets.type
    ],
    fireRequest
  );

  yield takeLatest(FETCH_API_SPECIFICATION_REQUEST, retrieveApiSpecification);
  yield takeLatest(FETCH_DATASETS_REQUEST, retrieveDataset);
}
