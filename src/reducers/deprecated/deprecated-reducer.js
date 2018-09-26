import DetailsReducer from '../details';
import isObject from '../../shared/services/is-object';

import DataSelectionReducer from '../data-selection-reducers';
import MapPreviewPanelReducer from '../../map/ducks/preview-panel/map-preview-panel';
import PageReducer from '../page-reducers';
import homeReducer from '../home-reducers';
import filtersReducers from './filters-reducers';
import straatbeeldReducers from './straatbeeld-reducers';
import MapSearchResultsReducer from '../../map/ducks/search-results/map-search-results';
import MapClickLocationReducer from '../../map/ducks/click-location/map-click-location';
import searchReducers from './search-reducers';
import deepFreeze from '../../shared/services/freeze/freeze';
import urlReducersInit from '../url-reducers';
import { isDevelopment } from '../../shared/environment';
import stateUrlConverter from '../../shared/services/routing/state-url-converter';

export default (oldState, action) => {
  const UrlReducers = urlReducersInit(stateUrlConverter);

  const detailReducers = { // TODO: try moving to root reducer
    FETCH_DETAIL: DetailsReducer,
    SHOW_DETAIL: DetailsReducer,
    DETAIL_FULLSCREEN: DetailsReducer
  };

  const mapSearchResultsReducers = { // TODO: try moving to root reducer
    FETCH_MAP_SEARCH_RESULTS_REQUEST: MapSearchResultsReducer,
    FETCH_MAP_SEARCH_RESULTS_SUCCESS: MapSearchResultsReducer,
    FETCH_MAP_SEARCH_RESULTS_FAILURE: MapSearchResultsReducer
  };

  const mapClickLocationReducers = { // TODO: try moving to root reducer
    SET_MAP_CLICK_LOCATION: MapClickLocationReducer
  };

  const mapPreviewPanelReducers = {
    OPEN_MAP_PREVIEW_PANEL: MapPreviewPanelReducer,
    CLOSE_MAP_PREVIEW_PANEL: MapPreviewPanelReducer,
    MAXIMIZE_MAP_PREVIEW_PANEL: MapPreviewPanelReducer
  };

  const actions = {
    ...DataSelectionReducer,
    ...detailReducers,
    ...filtersReducers,
    ...homeReducer,
    ...mapPreviewPanelReducers,
    ...mapSearchResultsReducers,
    ...mapClickLocationReducers,
    ...PageReducer,
    ...searchReducers,
    ...straatbeeldReducers,
    ...UrlReducers
  };

  // if the action type is found in the deprecated reducers handle the action here
  const handledByOldReducers = isObject(action) &&
    typeof actions[action.type] === 'function';

  // eslint-disable-next-line no-prototype-builtins
  const handlesAction = (reducer, actionType) => reducer.hasOwnProperty(actionType);

  if (handledByOldReducers) {
    let newState;

    // reformat the action for the detailReducers
    if (handlesAction(detailReducers, action.type) ||
      handlesAction(mapClickLocationReducers, action.type) ||
      handlesAction(mapSearchResultsReducers, action.type) ||
      handlesAction(mapPreviewPanelReducers, action.type)
    ) {
      newState = actions[action.type](oldState, action);
    } else {
      newState = actions[action.type](oldState, action.payload);
    }

    // TODO make isDevelopment Vanilla JS
    if (isDevelopment()) {
      deepFreeze(newState); // TODO
    }

    return newState;
  }

  return oldState;
};
