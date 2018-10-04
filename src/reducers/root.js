import { combineReducers } from 'redux';

import AutoSuggestReducer from '../header/ducks/auto-suggest/auto-suggest';
import DataSelectionReducer from '../shared/ducks/data-selection/data-selection';
import DataSelectionCatalogReducer from '../catalog/ducks/data-selection/data-selection-catalog';
import ErrorMessageReducer from '../shared/ducks/error-message';
import PageReducer from '../shared/ducks/page/page';
import UiReducer from '../shared/ducks/ui/ui';
import UserReducer from './user';
import MapDetailReducer from '../map/ducks/detail/map-detail';
import MapReducer from '../map/ducks/map/map';
import MapLayersReducer from '../map/ducks/layers/map-layers';
import MapBaseLayersReducer from '../map/ducks/base-layers/map-base-layers';
import MapPanelLayersReducer from '../map/ducks/panel-layers/map-panel-layers';
import StraatbeeldReducer from '../shared/ducks/straatbeeld/straatbeeld';
import PanoPreviewReducer from '../pano/ducks/preview/pano-preview';
import deprecatedReducer from './deprecated/deprecated-reducer';
import CurrentPageReducer from './current-page-reducer';

export default (routeReducer) => (oldState, action) => {
  // Run state changes based on old reducers
  const deprecatedState = deprecatedReducer(oldState, action);

  const mapLayers = combineReducers({
    layers: MapLayersReducer,
    baseLayers: MapBaseLayersReducer,
    panelLayers: MapPanelLayersReducer
  });

  // Use combine reducer for new reducers
  const newRootReducer = combineReducers({
    dataSelection: DataSelectionReducer,
    page: PageReducer,
    error: ErrorMessageReducer,
    map: MapReducer,
    mapDetail: MapDetailReducer,
    pano: PanoPreviewReducer,
    straatbeeld: StraatbeeldReducer,
    ui: UiReducer,
    user: UserReducer,
    mapLayers,
    autoSuggest: AutoSuggestReducer,
    catalogFilters: DataSelectionCatalogReducer,
    location: routeReducer,
    currentPage: CurrentPageReducer
  });
  const filteredState = {
    dataSelection: deprecatedState.dataSelection,
    page: deprecatedState.page,
    map: deprecatedState.map,
    mapDetail: deprecatedState.mapDetail,
    straatbeeld: deprecatedState.straatbeeld,
    ui: deprecatedState.ui,
    user: deprecatedState.user,

    // Using oldState instead of chaining deprecatedState from
    // other reducer for the following fields.
    // This is because these fields do not recide in the URL state,
    // the URL resolution step in the deprecatedReducer would
    // therefore reset these fields in the state.
    error: oldState.error,
    pano: oldState.pano,
    mapLayers: oldState.mapLayers,
    autoSuggest: oldState.autoSuggest,
    catalogFilters: oldState.catalogFilters,
    location: oldState.location,
    currentPage: oldState.currentPage
  };

  // Combine old and new reducer states
  const newState = {
    ...deprecatedState,
    ...newRootReducer(filteredState, action)
  };

  return newState;
};
