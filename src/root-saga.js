import { all, fork } from 'redux-saga/effects'
import watchFetchMapDetail from './map/sagas/detail'
import watchFetchMapBaseLayers from './map/sagas/map-base-layers'
import watchMapClick from './map/sagas/map-click'
import watchFetchMapLayers from './map/sagas/map-layers'
import watchFetchMapPanelLayers from './map/sagas/map-panel-layers'
import watchFetchNearestDetails from './map/sagas/nearest-details'
import { watchClosePanorama, watchFetchPanorama } from './panorama/sagas/panorama'
import watchFetchPanoPreview from './panorama/sagas/preview/panorama-preview'
import watchDataSearch from './shared/sagas/data-search/data-search'
import watchFetchDataSelection from './shared/sagas/data-selection/data-selection'
import watchErrors from './shared/sagas/error/error'
import watchAuthenticationRequest from './shared/sagas/user/user'
import routeSaga from './store/redux-first-router/routeSaga'

export default function* rootSaga() {
  yield all([
    fork(watchFetchPanoPreview),
    fork(watchDataSearch),
    fork(watchFetchMapBaseLayers),
    fork(watchFetchMapLayers),
    fork(watchFetchMapPanelLayers),
    fork(watchFetchMapDetail),
    fork(watchFetchPanorama),
    fork(watchClosePanorama),
    fork(watchMapClick),
    fork(watchFetchNearestDetails),
    fork(watchAuthenticationRequest),
    fork(watchFetchDataSelection),
    fork(routeSaga),
    fork(watchErrors),
  ])
}
