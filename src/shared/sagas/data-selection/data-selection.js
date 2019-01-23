import { call, put, select, take, takeLatest } from 'redux-saga/effects';
import {
  fetchDataSelection,
  receiveDataSelectionFailure,
  receiveDataSelectionSuccess,
  removeGeometryFilter,
  setMarkers
} from '../../ducks/data-selection/actions';
import dataSelectionConfig from '../../services/data-selection/data-selection-config';
import { getMarkers, query } from '../../services/data-selection/data-selection-api';
import { getMapBoundingBox, getMapZoom } from '../../../map/ducks/map/map-selectors';
import {
  ADD_FILTER,
  EMPTY_FILTERS,
  getFiltersWithoutShape,
  REMOVE_FILTER
} from '../../ducks/filters/filters';
import { preserveQuery, toDatasetPage } from '../../../store/redux-first-router/actions';
import { isDataSelectionPage } from '../../../store/redux-first-router/selectors';
import { cancel, disable, enable, setPolygon } from '../../../map/services/draw-tool/draw-tool';
import {
  CANCEL_DATA_SELECTION,
  END_DATA_SELECTION,
  FETCH_DATA_SELECTION_REQUEST,
  REMOVE_GEOMETRY_FILTER,
  RESET_DATA_SELECTION,
  SET_DATASET,
  SET_GEOMETRY_FILTER,
  SET_PAGE,
  START_DATA_SELECTION, VIEWS_TO_PARAMS
} from '../../ducks/data-selection/constants';
import {
  getDataSelection,
  getGeomarkersShape,
  getGeometryFilters
} from '../../ducks/data-selection/selectors';
import { waitForAuthentication } from '../user/user';
import {
  closeMapPanel,
  MAP_BOUNDING_BOX,
  mapEmptyGeometry,
  mapEndDrawing,
  mapLoadingAction,
  mapStartDrawing
} from '../../../map/ducks/map/map';
import PARAMETERS from '../../../store/parameters';
import drawToolConfig from '../../../map/services/draw-tool/draw-tool.config';
import { getViewMode, SET_VIEW_MODE, VIEW_MODE } from '../../ducks/ui/ui';

function* getMapMarkers(dataset, activeFilters) {
  // Since bounding box can be set later, we check if we have to wait for the boundingbox to get set
  let boundingBox = yield select(getMapBoundingBox);
  if (!boundingBox) {
    yield take(MAP_BOUNDING_BOX);
    boundingBox = yield select(getMapBoundingBox);
  }
  const mapZoom = yield select(getMapZoom);
  const markerData = yield call(getMarkers,
    dataset, activeFilters, mapZoom, boundingBox);
  yield put(setMarkers(markerData));
}

function* retrieveDataSelection(action) {
  const {
    dataset,
    page,
    searchText,
    catalogFilters
  } = action.payload;

  try {
    yield call(waitForAuthentication);
    const activeFilters = yield select(getFiltersWithoutShape);
    const shape = yield select(getGeomarkersShape);
    const view = yield select(getViewMode);
    // exclude the geometryFilter from the attribute filters
    // TODO DP-6442 improve the geometryFilter handling
    const activeAttributeFilters = Object.keys(activeFilters)
                                         .reduce((result, key) => ({
                                           ...result,
                                           [key]: activeFilters[key]
                                         }), {});

    const result = yield call(
      query,
      dataset,
      VIEWS_TO_PARAMS[view],
      activeAttributeFilters,
      page,
      searchText,
      shape,
      catalogFilters
    );

    // Put the results in the reducer
    yield put(receiveDataSelectionSuccess({
      dataset, activeFilters, page, shape, result
    }));

    // Check if markers need to be fetched
    const { MAX_NUMBER_OF_CLUSTERED_MARKERS } = dataSelectionConfig.datasets[dataset];
    const markersShouldBeFetched = (
      view !== VIEW_MODE.FULL && result.numberOfRecords <= MAX_NUMBER_OF_CLUSTERED_MARKERS
    );

    if (markersShouldBeFetched) {
      yield put(mapLoadingAction(true));
      yield call(getMapMarkers, dataset, { ...activeFilters, shape });
      yield put(mapLoadingAction(false));
    }
    yield put(mapLoadingAction(false)); // reset loading after retrieving data selection
  } catch (e) {
    yield put(receiveDataSelectionFailure({
      error: e.message,
      dataset
    }));
    yield put(mapLoadingAction(false));
  }
}

function* requestDataSelectionEffect() {
  yield put(mapLoadingAction(true));
  const dataSelection = yield select(getDataSelection);
  yield put(
    fetchDataSelection({
      ...dataSelection
    })
  );
}

export function* fetchDataSelectionEffect() {
  const dataSelectionPage = yield select(isDataSelectionPage);
  const view = yield select(getViewMode);
  if (view === VIEW_MODE.SPLIT) {
    yield put(closeMapPanel());
  }

  // Always ensure we are on the right page, otherwise this can be called unintentionally
  if (dataSelectionPage) {
    yield call(requestDataSelectionEffect);
  }
}

function* clearShapeFilter(action) {
  if (action.payload === 'shape') {
    yield put(removeGeometryFilter());
  }
}

function* switchPage(additionalParams = {}) {
  const { dataset } = yield select(getDataSelection);
  yield put(preserveQuery(toDatasetPage(dataset), additionalParams));
}

function* setGeometryFilters({ payload }) {
  const geometryFilters = yield select(getGeometryFilters);
  const dataSelectionPage = yield select(isDataSelectionPage);
  yield put(mapEndDrawing({ polygon: payload }));

  // Don't switch page if line is drawn
  if (payload.markers.length > 2) {
    // We shouldn't switch page if we are on a dataSelection page
    if (dataSelectionPage) {
      yield call(requestDataSelectionEffect);
    } else {
      yield call(switchPage, {
        [PARAMETERS.GEO]: geometryFilters,
        [PARAMETERS.VIEW]: VIEW_MODE.SPLIT
      });
    }
  }
}

function* clearDrawing() {
  yield call(setPolygon, []);
  yield call(enable);
  yield put(mapEmptyGeometry());
}

function* startDrawing() {
  yield call(setPolygon, []);
  yield call(enable);
  yield put(mapStartDrawing({ drawingMode: drawToolConfig.DRAWING_MODE.DRAW }));
}

function* endDrawing() {
  yield call(disable);
}

function* cancelDrawing() {
  yield put(mapEmptyGeometry());
  yield call(cancel);
}

export default function* watchFetchDataSelection() {
  yield takeLatest(REMOVE_FILTER, clearShapeFilter);
  yield takeLatest(SET_GEOMETRY_FILTER, setGeometryFilters);
  yield takeLatest(
    [SET_VIEW_MODE, SET_PAGE, ADD_FILTER, REMOVE_FILTER, REMOVE_GEOMETRY_FILTER, EMPTY_FILTERS],
    fetchDataSelectionEffect
  );

  // Actions
  yield takeLatest(FETCH_DATA_SELECTION_REQUEST, retrieveDataSelection);
  yield takeLatest([SET_DATASET], switchPage);

  yield takeLatest(RESET_DATA_SELECTION, clearDrawing);
  yield takeLatest(START_DATA_SELECTION, startDrawing);
  yield takeLatest(END_DATA_SELECTION, endDrawing);
  yield takeLatest(CANCEL_DATA_SELECTION, cancelDrawing);
}
