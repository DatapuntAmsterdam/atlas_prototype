import { combineReducers } from 'redux';

import AutoSuggestReducer from '../header/ducks/auto-suggest/auto-suggest';
import ErrorMessageReducer from '../shared/ducks/error-message';
import PageReducer from '../shared/ducks/page/page';
import UiReducer, { REDUCER_KEY as UI } from '../shared/ducks/ui/ui';
import UserReducer, { REDUCER_KEY as USER } from '../shared/ducks/user/user';
import MapDetailReducer from '../map/ducks/detail/map-detail';
import MapReducer from '../map/ducks/map/map';
import MapLayersReducer from '../map/ducks/layers/map-layers';
import MapBaseLayersReducer from '../map/ducks/base-layers/map-base-layers';
import MapPanelLayersReducer from '../map/ducks/panel-layers/map-panel-layers';
import PanoramaReducer, { REDUCER_KEY as PANORAMA } from '../panorama/ducks/panorama';
import PanoPreviewReducer, { REDUCER_KEY as PANO_PREVIEW } from '../panorama/ducks/preview/panorama-preview';
import FiltersReducer, { REDUCER_KEY as FILTER } from '../shared/ducks/filters/filters';
import DetailReducer, { REDUCER_KEY as DETAIL } from '../shared/ducks/detail/reducer';
import DataSearchReducer, { REDUCER_KEY as DATA_SEARCH } from '../shared/ducks/data-search/reducer';
import SelectionReducer, { REDUCER_KEY as SELECTION } from '../shared/ducks/selection/selection';
import DataSelectionReducer, { REDUCER_KEY as DATA_SELECTION } from '../shared/ducks/data-selection/reducer';
import DatasetReducer, { REDUCER_KEY as DATASET } from '../shared/ducks/datasets/datasets';

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
    map: MapReducer,
    mapDetail: MapDetailReducer,
    [PANO_PREVIEW]: PanoPreviewReducer,
    [PANORAMA]: PanoramaReducer,
    [UI]: UiReducer,
    [USER]: UserReducer,
    mapLayers,
    autoSuggest: AutoSuggestReducer,
    location: routeReducer,
    [DETAIL]: DetailReducer,
    [DATA_SEARCH]: DataSearchReducer,
    [SELECTION]: SelectionReducer,
    [DATA_SELECTION]: DataSelectionReducer,
    [DATASET]: DatasetReducer
  });

  // Combine legacy and new reducer states
  return newRootReducer(oldState, action);
};
