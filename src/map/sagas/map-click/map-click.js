import { call, put, select, takeLatest } from 'redux-saga/effects';
import { getLayers } from '../../ducks/panel-layers/map-panel-layers';
import { SET_MAP_CLICK_LOCATION } from '../../ducks/map/map';
import { getMapZoom } from '../../ducks/map/map-selectors';
import { REQUEST_NEAREST_DETAILS } from '../geosearch/geosearch';
import { getSelectionType, SELECTION_TYPE } from '../../../shared/ducks/selection/selection';
import { setPanoramaLocation } from '../../../panorama/ducks/actions';
import { normalizeLocation } from '../../../shared/services/coordinate-reference-system';
import { toGeoSearch } from '../../../store/redux-first-router/actions';
import { getPage } from '../../../store/redux-first-router/selectors';
import PAGES from '../../../app/pages';
import { VIEWS } from '../../../shared/ducks/data-search/constants';
import { getView as getDataSearchView } from '../../../shared/ducks/data-search/selectors';
import { DETAIL_VIEW } from '../../../shared/ducks/detail/constants';
import { getView as getDetailView } from '../../../shared/ducks/detail/selectors';
import { getDataSelectionView } from '../../../shared/ducks/data-selection/selectors';
import { VIEWS as DATA_SELECTION_VIEWS } from '../../../shared/ducks/data-selection/constants';

const latitudeLongitudeToArray = (location) => [location.latitude, location.longitude];

const showGeoSearchList = (pageType, dataSearchView, detailView, dataSelectionView) => (
  ((pageType === PAGES.DATA_GEO_SEARCH) && dataSearchView !== VIEWS.MAP) ||
  ((pageType === PAGES.DATA_DETAIL) && detailView !== DETAIL_VIEW.MAP) ||
  ((
    pageType === PAGES.ADDRESSES ||
    pageType === PAGES.ESTABLISHMENTS ||
    pageType === PAGES.CADASTRAL_OBJECTS
  ) && dataSelectionView !== DATA_SELECTION_VIEWS.MAP)
);

export function* goToGeoSearch(location) {
  const pageType = yield select(getPage);
  const dataSearchView = yield select(getDataSearchView);
  const dataSelectionView = yield select(getDataSelectionView);
  const detailView = yield select(getDetailView);
  const view = showGeoSearchList(pageType, dataSearchView, detailView, dataSelectionView) ?
    VIEWS.LIST :
    VIEWS.MAP;
  yield put(toGeoSearch(location, view));
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
      yield call(goToGeoSearch, location);
    }
  }
}

export default function* watchMapClick() {
  yield takeLatest(SET_MAP_CLICK_LOCATION, switchClickAction);
}
