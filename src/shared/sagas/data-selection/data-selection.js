import { all, call, put, select, take, takeLatest, throttle } from 'redux-saga/effects'
import {
  fetchDataSelection,
  fetchMarkersFailure,
  fetchMarkersRequest,
  fetchMarkersSuccess,
  receiveDataSelectionFailure,
  receiveDataSelectionSuccess,
  removeGeometryFilter,
} from '../../ducks/data-selection/actions'
import dataSelectionConfig from '../../services/data-selection/data-selection-config'
import { getMarkers, query } from '../../services/data-selection/data-selection-api'
import { getMapZoom, getMapBoundingBox } from '../../../map/ducks/map/selectors'
import {
  ADD_FILTER,
  EMPTY_FILTERS,
  getFiltersWithoutShape,
  REMOVE_FILTER,
} from '../../ducks/filters/filters'
import { preserveQuery, toDatasetPage } from '../../../store/redux-first-router/actions'
import {
  getPage,
  isDataSelectionPage,
  hasUserAccesToPage,
} from '../../../store/redux-first-router/selectors'
import { cancel, disable, enable, setPolygon } from '../../../map/services/draw-tool/draw-tool'
import {
  CANCEL_DATA_SELECTION,
  END_DATA_SELECTION,
  FETCH_DATA_SELECTION_REQUEST,
  FETCH_MARKERS_REQUEST,
  REMOVE_GEOMETRY_FILTER,
  RESET_DATA_SELECTION,
  SET_DATASET,
  SET_GEOMETRY_FILTER,
  SET_PAGE,
  START_DATA_SELECTION,
  VIEWS_TO_PARAMS,
  FETCH_MARKERS_SUCCESS,
  FETCH_DATA_SELECTION_SUCCESS,
} from '../../ducks/data-selection/constants'
import {
  getDataSelection,
  getDataSelectionPage,
  getDataset,
  getGeomarkersShape,
  getGeometryFilter,
  getGeometryFiltersMarkers,
} from '../../ducks/data-selection/selectors'
import { waitForAuthentication } from '../user/user'
import { MAP_BOUNDING_BOX } from '../../../map/ducks/map/constants'
import {
  closeMapPanel,
  mapEmptyGeometry,
  mapEndDrawing,
  mapSetDrawingMode,
  mapLoadingAction,
} from '../../../map/ducks/map/actions'
import PARAMETERS from '../../../store/parameters'
import drawToolConfig from '../../../map/services/draw-tool/draw-tool.config'
import { getViewMode, SET_VIEW_MODE, ViewMode } from '../../ducks/ui/ui'
import PAGES from '../../../app/pages'
import BOUNDING_BOX from '../../../map/services/bounding-box.constant'

export function* mapBoundsEffect() {
  const page = yield select(getPage)
  yield call(waitForAuthentication)
  const callFetchMarkers = yield select(hasUserAccesToPage)

  if (page === PAGES.CADASTRAL_OBJECTS && callFetchMarkers) {
    yield put(fetchMarkersRequest())
  }
}

export function* calculateBoundingBoxForSelection() {
  const filterMarkers = yield select(getGeometryFiltersMarkers)

  // When there is a geometry filter used use the wole extend of Amsterdam,
  //   in this way also parcels that are outside the current map view are selected
  let boundingBox = filterMarkers.length > 0 ? BOUNDING_BOX.COORDINATES : null
  if (!boundingBox) {
    // When there are just attribute filters present, use the current map extent for the filters.
    boundingBox = yield select(getMapBoundingBox)

    // Since bounding box can be set later,
    //   we check if we have to wait for the boundingbox to get set
    if (!boundingBox) {
      yield take(MAP_BOUNDING_BOX)
      boundingBox = yield select(getMapBoundingBox)
    }
  }
  return boundingBox
}

export function* requestMarkersEffect() {
  // Since bounding box can be set later, we check if we have to wait for the boundingbox to get set
  const [activeFilters, dataset, shape] = yield all([
    select(getFiltersWithoutShape),
    select(getDataset),
    select(getGeomarkersShape),
  ])

  const boundingBox = yield calculateBoundingBoxForSelection()
  const mapZoom = yield select(getMapZoom)
  try {
    const markerData = yield call(
      getMarkers,
      dataset,
      { shape, ...activeFilters },
      mapZoom,
      boundingBox,
    )
    yield put(fetchMarkersSuccess(markerData))
  } catch (e) {
    yield put(fetchMarkersFailure(e))
  }
}

function* retrieveDataSelection(action) {
  const { searchText, catalogFilters } = action.payload

  try {
    yield call(waitForAuthentication)

    const [activeFilters, shape, view, dataset, page, userAccesToPage] = yield all([
      select(getFiltersWithoutShape),
      select(getGeomarkersShape),
      select(getViewMode),
      select(getDataset),
      select(getDataSelectionPage),
      select(hasUserAccesToPage),
    ])
    // exclude the geometryFilter from the attribute filters
    // TODO DP-6442 improve the geometryFilter handling
    const activeAttributeFilters = Object.keys(activeFilters).reduce(
      (result, key) => ({
        ...result,
        [key]: activeFilters[key],
      }),
      {},
    )

    const result = userAccesToPage
      ? yield call(
          query,
          dataset,
          VIEWS_TO_PARAMS[view],
          activeAttributeFilters,
          page,
          searchText,
          shape,
          catalogFilters,
        )
      : {}
    // Put the results in the reducer
    yield put(receiveDataSelectionSuccess({ activeFilters, shape, result }))

    // Check if markers need to be fetched
    const { MAX_NUMBER_OF_CLUSTERED_MARKERS } = dataSelectionConfig.datasets[dataset]
    const filtersWithoutShape = yield select(getFiltersWithoutShape)
    const markersShouldBeFetched =
      view !== ViewMode.Full &&
      result.numberOfRecords <= MAX_NUMBER_OF_CLUSTERED_MARKERS &&
      (shape !== '[]' || Object.keys(filtersWithoutShape).length)
    if (markersShouldBeFetched) {
      yield put(fetchMarkersRequest())
    }
  } catch (e) {
    yield put(receiveDataSelectionFailure(e.message))
  }
}

function* requestDataSelectionEffect() {
  const dataSelection = yield select(getDataSelection)
  yield put(
    fetchDataSelection({
      ...dataSelection,
    }),
  )
}

export function* fetchDataSelectionEffect() {
  const view = yield select(getViewMode)
  if (view === ViewMode.Split) {
    yield put(closeMapPanel())
  }

  yield call(waitForAuthentication)
  const callDataSelection = yield select(hasUserAccesToPage)

  // Always ensure we are on the right page, otherwise this can be called unintentionally
  if (callDataSelection) {
    yield call(requestDataSelectionEffect)
  } else {
    yield put(
      receiveDataSelectionSuccess({
        result: null,
      }),
    )
  }
}

function* clearShapeFilter(action) {
  if (action.payload === 'shape') {
    yield put(removeGeometryFilter())
  }
}

function* switchPage(additionalParams = {}) {
  const { dataset } = yield select(getDataSelection)
  yield put(preserveQuery(toDatasetPage(dataset), additionalParams))
}

function* setGeometryFilters({ payload }) {
  const geometryFilters = yield select(getGeometryFilter)
  const dataSelectionPage = yield select(isDataSelectionPage)
  yield put(mapEndDrawing({ polygon: payload }))

  // Don't switch page if line is drawn
  if (payload.markers.length > 2) {
    // We shouldn't switch page if we are on a dataSelection page
    if (dataSelectionPage) {
      yield call(requestDataSelectionEffect)
    } else {
      yield call(switchPage, {
        [PARAMETERS.GEO]: geometryFilters,
        [PARAMETERS.VIEW]: ViewMode.Split,
      })
    }
  }
}

function* clearDrawing() {
  yield call(setPolygon, [])
  yield call(enable)
  yield put(mapEmptyGeometry())
}

function* startDrawing() {
  yield call(setPolygon, [])
  yield call(enable)
  yield put(mapSetDrawingMode({ drawingMode: drawToolConfig.DRAWING_MODE.DRAW }))
}

function* endDrawing() {
  yield call(disable)
}

function* cancelDrawing() {
  yield put(mapEmptyGeometry())
  yield call(cancel)
}

function* startMapLoading() {
  yield put(mapLoadingAction(true))
}

function* endMapLoading() {
  yield put(mapLoadingAction(false))
}

export default function* watchFetchDataSelection() {
  yield takeLatest(REMOVE_FILTER, clearShapeFilter)
  yield takeLatest(SET_GEOMETRY_FILTER, setGeometryFilters)
  yield throttle(5000, MAP_BOUNDING_BOX, mapBoundsEffect)
  yield takeLatest(
    [SET_VIEW_MODE, SET_PAGE, ADD_FILTER, REMOVE_FILTER, REMOVE_GEOMETRY_FILTER, EMPTY_FILTERS],
    fetchDataSelectionEffect,
  )

  yield takeLatest(FETCH_DATA_SELECTION_REQUEST, retrieveDataSelection)
  yield takeLatest(SET_DATASET, switchPage)
  yield takeLatest(FETCH_MARKERS_REQUEST, requestMarkersEffect)
  yield takeLatest([FETCH_DATA_SELECTION_REQUEST, FETCH_MARKERS_REQUEST], startMapLoading)
  yield takeLatest([FETCH_DATA_SELECTION_SUCCESS, FETCH_MARKERS_SUCCESS], endMapLoading)

  yield takeLatest(RESET_DATA_SELECTION, clearDrawing)
  yield takeLatest(START_DATA_SELECTION, startDrawing)
  yield takeLatest(END_DATA_SELECTION, endDrawing)
  yield takeLatest(CANCEL_DATA_SELECTION, cancelDrawing)
}
