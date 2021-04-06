import { call, put, select, takeLatest } from 'redux-saga/effects'
import { preserveQuery } from '../../../store/redux-first-router/actions'
import { isDataSelectionPage } from '../../../store/redux-first-router/selectors'
import { cancel, disable, enable, setPolygon } from '../../../map/services/draw-tool/draw-tool'
import {
  CANCEL_DATA_SELECTION,
  END_DATA_SELECTION,
  RESET_DATA_SELECTION,
  SET_GEOMETRY_FILTER,
  START_DATA_SELECTION,
} from '../../ducks/data-selection/constants'
import { getGeometryFilter } from '../../ducks/data-selection/selectors'
import { mapEmptyGeometry, mapEndDrawing, mapSetDrawingMode } from '../../../map/ducks/map/actions'
import PARAMETERS from '../../../store/parameters'
import drawToolConfig from '../../../map/services/draw-tool/draw-tool.config'
import { ViewMode } from '../../ducks/ui/ui'
import { routing } from '../../../app/routes'

function* setGeometryFilters({ payload }) {
  const geometryFilters = yield select(getGeometryFilter)
  const dataSelectionPage = yield select(isDataSelectionPage)
  yield put(mapEndDrawing({ polygon: payload }))

  // Don't switch page if line is drawn
  if (payload.markers.length > 2) {
    // We shouldn't switch page if we are on a dataSelection page
    if (!dataSelectionPage) {
      yield put(
        preserveQuery(
          { type: routing.addresses.type },
          {
            [PARAMETERS.GEO]: geometryFilters,
            [PARAMETERS.VIEW]: ViewMode.Split,
          },
        ),
      )
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

export default function* watchFetchDataSelection() {
  yield takeLatest(SET_GEOMETRY_FILTER, setGeometryFilters)
  yield takeLatest(RESET_DATA_SELECTION, clearDrawing)
  yield takeLatest(START_DATA_SELECTION, startDrawing)
  yield takeLatest(END_DATA_SELECTION, endDrawing)
  yield takeLatest(CANCEL_DATA_SELECTION, cancelDrawing)
}
