import { call, put, select, takeLatest } from 'redux-saga/effects';
import { getLayers } from '../../ducks/panel-layers/map-panel-layers';
import { getPanoramaYear } from '../../../shared/ducks/panorama/panorama';
import { SET_MAP_CLICK_LOCATION } from '../../ducks/map/map';
import { getMapZoom } from '../../ducks/map/map-selectors';
import { REQUEST_NEAREST_DETAILS } from '../geosearch/geosearch';
import { getSelectionType, SELECTION_TYPE } from '../../../shared/ducks/selection/selection';
import { getImageDataByLocation } from '../../../shared/services/panorama-api/panorama-api';
import { toPanorama } from '../../../store/redux-first-router';
import { setGeoLocation } from '../../../shared/ducks/data-search/actions';

function getHeadingDegrees([x1, y1], [x2, y2]) {
  return (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
}

const latitudeLongitudeToArray = (location) => [location.latitude, location.longitude];

/* istanbul ignore next */ // TODO: refactor, test
export function* switchClickAction(action) {
  const selectionType = yield select(getSelectionType);
  const { location } = action.payload;

  if (selectionType === SELECTION_TYPE.PANORAMA) {
    const year = yield select(getPanoramaYear);
    const locationArray = latitudeLongitudeToArray(location);
    const imageData = yield call(getImageDataByLocation, locationArray, year);

    // The view direction should be towards the location that the user clicked
    const heading = getHeadingDegrees(imageData.location, locationArray);

    yield put(toPanorama(imageData.id, heading));
  } else {
    const zoom = yield select(getMapZoom);
    const layers = yield select(getLayers);
    if (layers.length) { // eslint-disable-line no-lonely-if
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
