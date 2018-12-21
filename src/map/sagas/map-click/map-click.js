import { put, select, takeLatest } from 'redux-saga/effects';
import { getLayers } from '../../ducks/panel-layers/map-panel-layers';
import { SET_MAP_CLICK_LOCATION } from '../../ducks/map/map';
import { getMapZoom } from '../../ducks/map/map-selectors';
import { REQUEST_NEAREST_DETAILS } from '../geosearch/geosearch';
import { getSelectionType, SELECTION_TYPE } from '../../../shared/ducks/selection/selection';
import { setGeoLocation } from '../../../shared/ducks/data-search/actions';
import { setPanoramaLocation } from '../../../panorama/ducks/actions';

const latitudeLongitudeToArray = (location) => [location.latitude, location.longitude];

/* istanbul ignore next */ // TODO: refactor, test
export function* switchClickAction(action) {
  const selectionType = yield select(getSelectionType);
  const { location } = action.payload;

  if (selectionType === SELECTION_TYPE.PANORAMA) {
    const locationArray = latitudeLongitudeToArray(location);
    yield put(setPanoramaLocation(locationArray));
  } else {
    const zoom = yield select(getMapZoom);
    const layers = yield select(getLayers);
    if (layers.length) {
      yield put({
        type: REQUEST_NEAREST_DETAILS,
        payload: {
          location,
          layers,
          zoom
        }
      });
    } else {
      yield put(setGeoLocation(location));
    }
  }
}

export default function* watchMapClick() {
  yield takeLatest(SET_MAP_CLICK_LOCATION, switchClickAction);
}
