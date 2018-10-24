import { combineReducers } from 'redux';

import AutoSuggestReducer from '../header/ducks/auto-suggest/auto-suggest';
import DataSelectionCatalogReducer from '../catalog/ducks/data-selection/data-selection-catalog';
import ErrorMessageReducer from '../shared/ducks/error-message';
import PageReducer from '../shared/ducks/page/page';
import UiReducer, { REDUCER_KEY as UI } from '../shared/ducks/ui/ui';
import UserReducer from '../shared/ducks/user/user';
import MapDetailReducer from '../map/ducks/detail/map-detail';
import MapReducer from '../map/ducks/map/map';
import MapLayersReducer from '../map/ducks/layers/map-layers';
import MapBaseLayersReducer from '../map/ducks/base-layers/map-base-layers';
import MapPanelLayersReducer from '../map/ducks/panel-layers/map-panel-layers';
import StraatbeeldReducer from '../shared/ducks/straatbeeld/straatbeeld';
import PanoPreviewReducer from '../pano/ducks/preview/pano-preview';
import CatalogReducer from '../shared/ducks/catalog/catalog';
import FiltersReducer from '../shared/ducks/filters/filters';
import DetailReducer, { REDUCER_KEY as DETAIL } from '../shared/ducks/detail/detail';
import SearchReducer, { REDUCER_KEY as SEARCH } from '../shared/ducks/search/search';
import SelectionReducer, { REDUCER_KEY as SELECTION } from '../shared/ducks/selection/selection';
import LegacyReducer from './deprecated/legacy-reducer';
import NewDataSelectionReducer, { REDUCER_KEY as NEW_DATA_SELECTION } from '../shared/ducks/new-data-selection/new-data-selection';

export default (routeReducer) => (oldState = {}, action) => {
  const mapLayers = combineReducers({
    layers: MapLayersReducer,
    baseLayers: MapBaseLayersReducer,
    panelLayers: MapPanelLayersReducer
  });

  const legacyState = LegacyReducer(oldState, action);

  // Use combine reducer for new reducers
  const newRootReducer = combineReducers({
    catalog: CatalogReducer,
    page: PageReducer,
    error: ErrorMessageReducer,
    filters: FiltersReducer,
    map: MapReducer,
    mapDetail: MapDetailReducer,
    pano: PanoPreviewReducer,
    straatbeeld: StraatbeeldReducer,
    [UI]: UiReducer,
    user: UserReducer,
    mapLayers,
    autoSuggest: AutoSuggestReducer,
    catalogFilters: DataSelectionCatalogReducer,
    location: routeReducer,
    [DETAIL]: DetailReducer,
    [SEARCH]: SearchReducer,
    [SELECTION]: SelectionReducer,
    [NEW_DATA_SELECTION]: NewDataSelectionReducer
  });

  // Combine legacy and new reducer states
  return newRootReducer(legacyState, action);
};

