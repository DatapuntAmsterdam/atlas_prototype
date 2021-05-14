import { call, put, select, takeLatest } from 'redux-saga/effects'
import { locationParam, viewParam } from '../../../app/pages/MapPage/query-params'
import { setPanoramaLocation } from '../../../panorama/ducks/actions'
import { requestNearestDetails } from '../../../shared/ducks/data-search/actions'
import { getSelectionType, SELECTION_TYPE } from '../../../shared/ducks/selection/selection'
import { getViewMode, isEmbedded, ViewMode } from '../../../shared/ducks/ui/ui'
import { normalizeLocation } from '../../../shared/services/coordinate-reference-system'
import { toGeoSearch } from '../../../store/redux-first-router/actions'
import { SET_MAP_CLICK_LOCATION } from '../../ducks/map/constants'
import { getMapZoom } from '../../ducks/map/selectors'
import { getLayers } from '../../ducks/panel-layers/map-panel-layers'

const latitudeLongitudeToArray = (location) => [location.latitude, location.longitude]

export function* goToGeoSearch(location) {
  const viewMode = yield select(getViewMode)
  const view = viewMode === ViewMode.Split ? ViewMode.Split : ViewMode.Map
  yield put(
    toGeoSearch({
      [locationParam.name]: location,
      [viewParam.name]: view,
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
    const layers = yield select(getLayers)
    const view = yield select(getViewMode)
    const isEmbed = yield select(isEmbedded)

    if (layers.length) {
      yield put(
        requestNearestDetails({
          location,
          layers,
          zoom,
          view: view !== ViewMode.Map ? ViewMode.Split : ViewMode.Map,
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
