import ACTIONS, { FETCH_SEARCH_RESULTS_BY_LOCATION } from '../../actions';
import stateToUrl from '../routing/state-to-url';
import { AUTHENTICATE_USER } from '../../../reducers/user';
import {
  MAP_UPDATE_SHAPE,
  MAP_ZOOM_SILENT,
  MAP_PAN_SILENT,
  MAP_BOUNDING_BOX_SILENT,
  MAP_EMPTY_GEOMETRY,
  MAP_START_DRAWING
} from '../../../map/ducks/map/map';
import {
  SET_DATA_SELECTION_GEOMETRY_FILTER,
  RESET_DATA_SELECTION_GEOMETRY_FILTER
} from '../../ducks/data-selection/data-selection';
import {
  FETCH_CATALOG_FILTERS_REQUEST
} from '../../../catalog/ducks/data-selection/data-selection-catalog';

// old type actions
const urlIgnoreActions = [
  ACTIONS.URL_CHANGE,
  ACTIONS.FETCH_DETAIL,
  ACTIONS.MAP_CLICK,
  FETCH_SEARCH_RESULTS_BY_LOCATION,
  ACTIONS.FETCH_SEARCH_RESULTS_CATEGORY,
  ACTIONS.MAP_CLICK,
  ACTIONS.MAP_START_DRAWING,
  ACTIONS.FETCH_DETAIL,
  ACTIONS.FETCH_DATA_SELECTION,
  ACTIONS.RESET_DATA_SELECTION
];

const replaceActions = [
  ACTIONS.MAP_PAN,
  ACTIONS.MAP_ZOOM,
  ACTIONS.DETAIL_FULLSCREEN,
];

// union old type actions - ignored actions
const ignoreActions = [
  AUTHENTICATE_USER,
  MAP_START_DRAWING,
  MAP_EMPTY_GEOMETRY,
  MAP_UPDATE_SHAPE,
  MAP_ZOOM_SILENT,
  MAP_PAN_SILENT,
  MAP_BOUNDING_BOX_SILENT,
  SET_DATA_SELECTION_GEOMETRY_FILTER,
  RESET_DATA_SELECTION_GEOMETRY_FILTER,
  FETCH_CATALOG_FILTERS_REQUEST,
  ...urlIgnoreActions
];

const stateToUrlMiddleware = (store) => (next) => (action) => {
  // Update the state first
  const returnValue = next(action);
  const updateUrl = !ignoreActions.includes(action.type);
  const replaceUrl = replaceActions.includes(action.type);

  // Then update the URL
  if (updateUrl || replaceUrl) {
    stateToUrl.update(store.getState(), replaceUrl);
  }
  return returnValue;
};

export default stateToUrlMiddleware;
