import { delayt } from 'redux-saga';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import {
  fetchPanoramaError,
  fetchPanoramaRequest,
  fetchPanoramaSuccess
} from '../../panorama/ducks/actions';
import {
  getDetailReference,
  getPageReference,
  getPanoramaHeading,
  getPanoramaLocation,
  getPanoramaPitch,
  getPanoramaTags
} from '../../panorama/ducks/selectors';
import { closeMapPanel, toggleMapOverlayPanorama } from '../../map/ducks/map/actions';
import { getImageDataById, getImageDataByLocation } from '../services/panorama-api/panorama-api';
import { toDataDetail, toGeoSearch, toPanorama } from '../../store/redux-first-router/actions';
import { getLocationPayload } from '../../store/redux-first-router/selectors';
import { getViewMode, VIEW_MODE } from '../../shared/ducks/ui/ui';
import PARAMETERS from '../../store/parameters';
import { getMapOverlays, getMapCenter } from '../../map/ducks/map/selectors';
import {
  CLOSE_PANORAMA,
  FETCH_PANORAMA_HOTSPOT_REQUEST,
  FETCH_PANORAMA_REQUEST,
  FETCH_PANORAMA_SUCCESS,
  PAGE_REF_MAPPING,
  SET_PANORAMA_LOCATION,
  SET_PANORAMA_TAGS
} from '../ducks/constants';

export function* fetchFetchPanoramaEffect(action) {
  const view = yield select(getViewMode);
  if (view === VIEW_MODE.FULL || view === VIEW_MODE.SPLIT) {
    yield put(closeMapPanel());
  }
  yield put(fetchPanoramaRequest(action.payload));
}

export function* handlePanoramaRequest(fn, input, tags) {
  try {
    const panoramaData = yield call(fn, input, tags);

    console.log(panoramaData)

    yield put(fetchPanoramaSuccess({...panoramaData, tags}));
    yield put(toPanorama(panoramaData.id));
    yield call(delay(500));
    yield put(toggleMapOverlayPanorama(tags));
  } catch (error) {
    yield put(fetchPanoramaError(error));
  }
}

export function* fetchPanoramaById(action) {
  const tags = yield select(getPanoramaTags);
  yield call(handlePanoramaRequest, getImageDataById, action.payload.id, tags);
}

export function* fetchPanoramaByLocation(action) {
  const tags = yield select(getPanoramaTags);
  yield call(handlePanoramaRequest, getImageDataByLocation, action.payload, tags);
}

export function* fetchPanoramaByTags(action) {
  const location = yield select(getPanoramaLocation);
  yield call(handlePanoramaRequest, getImageDataByLocation, location, action.payload);
}

export function* updatePanoramaUrl(action) {
    const tags = yield select(getPanoramaTags);
    const viewCenter = yield select(getMapCenter);
    const heading = yield select(getPanoramaHeading);
    const location = yield select(getPanoramaLocation);
    const pitch = yield select(getPanoramaPitch);
    const layers = yield select(getMapOverlays);

    console.log('TAGS', tags)

    console.log(action.payload.id)

    yield put(toPanorama(action.payload.id, {
      preserve: false
    }));
}

export function* watchFetchPanorama() {
  yield all([
    takeLatest([FETCH_PANORAMA_HOTSPOT_REQUEST, FETCH_PANORAMA_REQUEST], fetchPanoramaById),
    takeLatest([SET_PANORAMA_LOCATION], fetchPanoramaByLocation),
    takeLatest([SET_PANORAMA_TAGS], fetchPanoramaByTags),
    takeLatest([FETCH_PANORAMA_SUCCESS], updatePanoramaUrl),
  ]);
}

/**
 * We have two types of 'references': detail and page
 * detailReference will contain the detail id of the page, and so will navigate to one if set
 * pageReference is mapped to an action that will be dispatched if set (and so will navigate to a
 * page.
 * By default, the panorama always has a location, so if pageReference or detailReference are not
 * set, do a geosearch based on th panorama's location
 * @returns {IterableIterator<*>}
 */
export function* doClosePanorama() {
  const detailReference = yield select(getDetailReference);
  const pageReference = yield select(getPageReference);
  const panoramaLocation = yield select(getPanoramaLocation);
  const overlays = yield select(getMapOverlays);

  if (Array.isArray(detailReference) && detailReference.length) {
    yield put(toDataDetail(detailReference, {
      [PARAMETERS.LAYERS]: overlays,
      [PARAMETERS.VIEW]: VIEW_MODE.SPLIT
    }));
  } else if (typeof PAGE_REF_MAPPING[pageReference] === 'function') {
    yield put(PAGE_REF_MAPPING[pageReference]());
  } else {
    yield put(toGeoSearch({
      [PARAMETERS.LOCATION]: panoramaLocation,
      [PARAMETERS.VIEW]: VIEW_MODE.SPLIT,
      [PARAMETERS.LAYERS]: overlays
    }));
  }
}

export function* watchClosePanorama() {
  yield takeLatest(CLOSE_PANORAMA, doClosePanorama);
}
