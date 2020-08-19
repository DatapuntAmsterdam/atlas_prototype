import { call, put, select, takeLatest } from 'redux-saga/effects'
import { setPanoramaLocation } from '../../../panorama/ducks/actions'
import { requestNearestDetails } from '../../../shared/ducks/data-search/actions'
import { getSelectionType, SELECTION_TYPE } from '../../../shared/ducks/selection/selection'
import { getViewMode, isEmbedded, VIEW_MODE } from '../../../shared/ducks/ui/ui'
import { normalizeLocation } from '../../../shared/services/coordinate-reference-system'
import PARAMETERS from '../../../store/parameters'
import { toGeoSearch } from '../../../store/redux-first-router/actions'
import { getLayersRaw } from '../../ducks/layers/map-layers'
import { SET_MAP_CLICK_LOCATION } from '../../ducks/map/constants'
import { getMapZoom } from '../../ducks/map/selectors'

const latitudeLongitudeToArray = (location) => [location.latitude, location.longitude]

export function* goToGeoSearch(location) {
  const viewMode = yield select(getViewMode)
  const view = viewMode === VIEW_MODE.SPLIT ? VIEW_MODE.SPLIT : VIEW_MODE.MAP
  yield put(
    toGeoSearch({
      [PARAMETERS.LOCATION]: location,
      [PARAMETERS.VIEW]: view,
    }),
  )
} // TODO: refactor, test

/* istanbul ignore next */ export function* switchClickAction(action) {
  const selectionType = yield select(getSelectionType)
  const location = normalizeLocation(action.payload.location, 7)
  if (selectionType === SELECTION_TYPE.PANORAMA) {
    const locationArray = latitudeLongitudeToArray(location)
    yield put(setPanoramaLocation(locationArray))
  } else {
    const zoom = yield select(getMapZoom)
    const layers = yield select(getLayersRaw)
    const view = yield select(getViewMode)
    const isEmbed = yield select(isEmbedded)

    if (layers.length) {
      yield put(
        requestNearestDetails({
          location,
          layers,
          zoom,
          view: view !== VIEW_MODE.MAP ? VIEW_MODE.SPLIT : VIEW_MODE.MAP,
        }),
      )
    } else if (!isEmbed) {
      yield call(goToGeoSearch, location)
    }
  }
}

export default function* watchMapClick() {
  yield takeLatest(SET_MAP_CLICK_LOCATION, switchClickAction)
}
