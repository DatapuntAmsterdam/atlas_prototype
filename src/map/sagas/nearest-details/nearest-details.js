import { call, put, select, takeLatest } from 'redux-saga/effects';
import fetchNearestDetail from '../../services/nearest-detail/nearest-detail';
import { REQUEST_NEAREST_DETAILS } from '../geosearch/geosearch';
import { toDetailFromEndpoint } from '../../../store/redux-first-router/actions';
import { getDetailView } from '../../../shared/ducks/detail/selectors';
import { showDetail } from '../../../shared/ducks/detail/actions';
import { FETCH_MAP_DETAIL_SUCCESS } from '../../ducks/detail/constants';
import { getGeometry } from '../../../shared/services/geometry/geometry';
import { goToGeoSearch } from '../map-click/map-click';

export function* fetchNearestDetails(action) {
  const {
    location,
    layers,
    zoom
  } = action.payload;
  try {
    const { uri } = yield call(fetchNearestDetail, location, layers, zoom);
    if (uri) {
      const view = yield select(getDetailView);
      yield put(toDetailFromEndpoint(uri, view));
    } else {
      yield call(goToGeoSearch, location);
    }
  } catch (error) {
    yield call(goToGeoSearch, location);
  }
}

export function* fireShowDetail(action) {
  yield put(showDetail({
    display: action.mapDetail._display,
    geometry: getGeometry(action.mapDetail)
  }));
}

export default function* watchFetchNearestDetails() {
  yield takeLatest(REQUEST_NEAREST_DETAILS, fetchNearestDetails);
  yield takeLatest(FETCH_MAP_DETAIL_SUCCESS, fireShowDetail);
}
