import { all, fork } from 'redux-saga/effects';

import watchFetchMapBaseLayers from './layers/map-base-layers';
import watchFetchMapLayers from './layers/map-layers';
import watchFetchMapSearchResults from './search-results/map-search-results';
import watchFetchMapDetail from './detail/map-detail';
import watchFetchParkeervakken from './parkeervakken/parkeervakken';
import watchFetchPanoPreview from '../../pano/sagas/preview/pano-preview';

export default function* rootSaga() {
  yield all([
    fork(watchFetchMapBaseLayers),
    fork(watchFetchMapLayers),
    fork(watchFetchMapSearchResults),
    fork(watchFetchMapDetail),
    fork(watchFetchParkeervakken),
    fork(watchFetchPanoPreview)
  ]);
}
