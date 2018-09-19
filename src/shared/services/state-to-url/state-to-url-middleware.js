import { AUTHENTICATE_USER } from '../../../reducers/user';
import {
  MAP_BOUNDING_BOX_SILENT,
  MAP_EMPTY_GEOMETRY, MAP_PAN_SILENT,
  MAP_START_DRAWING,
  MAP_UPDATE_SHAPE, MAP_ZOOM_SILENT
} from '../../../map/ducks/map/map';
import {
  RESET_DATA_SELECTION_GEOMETRY_FILTER,
  SET_DATA_SELECTION_GEOMETRY_FILTER
} from '../../ducks/data-selection/data-selection';
import { FETCH_CATALOG_FILTERS_REQUEST } from '../../../catalog/ducks/data-selection/data-selection-catalog';

const stateToUrlMiddleware = (store) => (next) => (action) => {
  // Are we dealing with vanilla js reducers here (type is a
  // string instead of an object with an ID and other
  // optional attributes)?
  const vanilla = typeof action.type === 'string';

  const ignoredActions = [
    AUTHENTICATE_USER,
    MAP_START_DRAWING,
    MAP_EMPTY_GEOMETRY,
    MAP_UPDATE_SHAPE,
    MAP_ZOOM_SILENT,
    MAP_PAN_SILENT,
    MAP_BOUNDING_BOX_SILENT,
    SET_DATA_SELECTION_GEOMETRY_FILTER,
    RESET_DATA_SELECTION_GEOMETRY_FILTER,
    FETCH_CATALOG_FILTERS_REQUEST
  ];

  // vanilla (new actions) that don't need to be saved to the location history (replace)
  const replaceHistoryActions = ['MAP_ZOOM', 'MAP_PAN'];

  // Update the state first
  const returnValue = next(action);

  // Then update the URL
  // window.stateToUrl is the angular factory that uses $location
  const stateToUrl = window.stateToUrl;
  if ((vanilla || !action.type.ignore) && !ignoredActions.includes(action.type)) {
    stateToUrl.update(
      store.getState(),
      ((!vanilla && Boolean(action.type.replace)) || (vanilla &&
      replaceHistoryActions.some((historyAction) => historyAction === action.type)))
    );
  }
  return returnValue;
};

export default stateToUrlMiddleware;
