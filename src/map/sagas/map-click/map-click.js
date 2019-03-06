import { call, put, select, takeLatest } from 'redux-saga/effects';
import { getLayers } from '../../ducks/panel-layers/map-panel-layers';
import { SET_MAP_CLICK_LOCATION } from '../../ducks/map/constants';
import { getMapZoom } from '../../ducks/map/selectors';
import { getSelectionType, SELECTION_TYPE } from '../../../shared/ducks/selection/selection';
import { setPanoramaLocation } from '../../../panorama/ducks/actions';
import { normalizeLocation } from '../../../shared/services/coordinate-reference-system';
import { toGeoSearch } from '../../../store/redux-first-router/actions';
import PARAMETERS from '../../../store/parameters';
import { requestNearestDetails } from '../../../shared/ducks/data-search/actions';
import { getViewMode, VIEW_MODE } from '../../../shared/ducks/ui/ui';

const latitudeLongitudeToArray = (location) => [location.latitude, location.longitude];

export function* goToGeoSearch(location) {
  const viewMode = yield select(getViewMode);
  const view = viewMode === VIEW_MODE.SPLIT ?
    VIEW_MODE.SPLIT :
    VIEW_MODE.MAP;
  yield put(toGeoSearch({
    [PARAMETERS.LOCATION]: location,
    [PARAMETERS.VIEW]: view
  }));
}

/* istanbul ignore next */ // TODO: refactor, test
export function* switchClickAction(action) {
  const selectionType = yield select(getSelectionType);
  const location = normalizeLocation(action.payload.location, 7);
  if (selectionType === SELECTION_TYPE.PANORAMA) {
    const locationArray = latitudeLongitudeToArray(location);
    yield put(setPanoramaLocation(locationArray));
  } else {
    const zoom = yield select(getMapZoom);
    const layers = yield select(getLayers);
    const view = yield select(getViewMode);

    if (layers.length) {
      yield put(
        requestNearestDetails({
          location,
          layers,
          zoom,
          view: (view !== VIEW_MODE.MAP) ? VIEW_MODE.SPLIT : VIEW_MODE.MAP
        })
      );
    } else {
      yield call(goToGeoSearch, location);
    }
  }
}

export default function* watchMapClick() {
  yield takeLatest(SET_MAP_CLICK_LOCATION, switchClickAction);
}
