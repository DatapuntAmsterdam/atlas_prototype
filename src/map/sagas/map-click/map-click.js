import { put, select, takeLatest } from 'redux-saga/effects';
import { getLayers } from '../../ducks/panel-layers/map-panel-layers';
import { getStraatbeeld } from '../../../shared/ducks/straatbeeld/straatbeeld';
import { SET_MAP_CLICK_LOCATION, UPDATE_MAP } from '../../ducks/map/map';
import { getMapZoom } from '../../ducks/map/map-selectors';

import { REQUEST_GEOSEARCH, REQUEST_NEAREST_DETAILS } from '../../../shared/actions';

export function* switchClickAction(payload) {
  const straatbeeld = yield select(getStraatbeeld);
  const zoom = yield select(getMapZoom);
  const layers = yield select(getLayers);

  if (!straatbeeld && layers.length) {
    yield put({
      type: REQUEST_NEAREST_DETAILS,
      payload: {
        location: payload.location,
        layers,
        zoom
      }
    });
  } else {
    yield put({
      type: REQUEST_GEOSEARCH,
      payload: [payload.location.latitude, payload.location.longitude]
    });
  }

  yield put({
    type: UPDATE_MAP,
    payload: {
      query: {
        selectedLocation: `${payload.location.latitude},${payload.location.longitude}`
      }
    }
  });
}

export default function* watchMapClick() {
  yield takeLatest(SET_MAP_CLICK_LOCATION, switchClickAction);
}
