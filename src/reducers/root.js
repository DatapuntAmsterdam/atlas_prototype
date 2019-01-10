import { combineReducers } from 'redux';

import { LOCATION } from '../store/redux-first-router/constants';
import AutoSuggestReducer from '../header/ducks/auto-suggest/auto-suggest';
import ErrorMessageReducer from '../shared/ducks/error-message';
import PageReducer from '../shared/ducks/page/page';
import UiReducer, { UI } from '../shared/ducks/ui/ui';
import UserReducer, { REDUCER_KEY as USER } from '../shared/ducks/user/user';
import MapDetailReducer from '../map/ducks/detail/map-detail';
import MapReducer, { MAP } from '../map/ducks/map/map';
import MapLayersReducer from '../map/ducks/layers/map-layers';
import MapBaseLayersReducer from '../map/ducks/base-layers/map-base-layers';
import MapPanelLayersReducer from '../map/ducks/panel-layers/map-panel-layers';
import PanoramaReducer, { PANORAMA } from '../panorama/ducks/reducer';
import PanoPreviewReducer, { REDUCER_KEY as PANO_PREVIEW } from '../panorama/ducks/preview/panorama-preview';
import FiltersReducer, { REDUCER_KEY as FILTER } from '../shared/ducks/filters/filters';
import DetailReducer, { DETAIL } from '../shared/ducks/detail/reducer';
import DataSearchReducer, { DATA_SEARCH_REDUCER } from '../shared/ducks/data-search/reducer';
import SelectionReducer, { REDUCER_KEY as SELECTION } from '../shared/ducks/selection/selection';
import DataSelectionReducer, { DATA_SELECTION } from '../shared/ducks/data-selection/reducer';
import DatasetReducer, { DATASETS } from '../shared/ducks/datasets/datasets';

export default (routeReducer) => (oldState = {}, action) => {
  const mapLayers = combineReducers({
    layers: MapLayersReducer,
    baseLayers: MapBaseLayersReducer,
    panelLayers: MapPanelLayersReducer
  });

  // Use combine reducer for new reducers
  const newRootReducer = combineReducers({
    page: PageReducer,
    error: ErrorMessageReducer,
    [FILTER]: FiltersReducer,
    [MAP]: MapReducer,
    mapDetail: MapDetailReducer,
    [PANO_PREVIEW]: PanoPreviewReducer,
    [PANORAMA]: PanoramaReducer,
    [UI]: UiReducer,
    [USER]: UserReducer,
    mapLayers,
    autoSuggest: AutoSuggestReducer,
    [LOCATION]: routeReducer,
    [DETAIL]: DetailReducer,
    [DATA_SEARCH_REDUCER]: DataSearchReducer,
    [SELECTION]: SelectionReducer,
    [DATA_SELECTION]: DataSelectionReducer,
    [DATASETS]: DatasetReducer
  });

  // Combine legacy and new reducer states
  return newRootReducer(oldState, action);
};
