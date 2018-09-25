import {
  MAP_ZOOM,
  MAP_PAN,
  MAP_ADD_PANO_OVERLAY,
  MAP_REMOVE_PANO_OVERLAY, MAP_END_DRAWING, MAP_START_DRAWING
} from '../map/ducks/map/map';
import { SET_MAP_CLICK_LOCATION } from '../map/ducks/click-location/map-click-location';
//
// ACTIONS are identified by their id
// Optionally an action can specify:
// - ignore: true
//   The action will not change the url
// - replace: true
//   The action will replace the url (not adding a new entry in the browser history)
//
//
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//
// Don't use this syntax unless you have to!
//
// DEPRECATED
//
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//
export default {
  URL_CHANGE: {
    id: 'URL_CHANGE',
    ignore: true
  },

  FETCH_SEARCH_RESULTS_BY_QUERY: {
    id: 'FETCH_SEARCH_RESULTS_BY_QUERY',
    ignore: true
  },
  FETCH_SEARCH_RESULTS_BY_LOCATION: {
    id: 'FETCH_SEARCH_RESULTS_BY_LOCATION',
    ignore: true
  },
  FETCH_SEARCH_RESULTS_CATEGORY: {
    id: 'FETCH_SEARCH_RESULTS_CATEGORY',
    ignore: true
  },
  SHOW_SEARCH_RESULTS: {
    id: 'SHOW_SEARCH_RESULTS'
  },
  MAP_ADD_PANO_OVERLAY: {
    id: MAP_ADD_PANO_OVERLAY,
    ignore: true
  },
  MAP_REMOVE_PANO_OVERLAY: {
    id: MAP_REMOVE_PANO_OVERLAY,
    ignore: true
  },
  MAP_CLICK: {
    id: 'MAP_CLICK',
    ignore: true
  },
  SET_MAP_CLICK_LOCATION: {
    id: SET_MAP_CLICK_LOCATION,
    ignore: true
  },
  MAP_PAN: {
    id: MAP_PAN,
    replace: true
  },
  MAP_ZOOM: {
    id: MAP_ZOOM,
    replace: true
  },
  MAP_START_DRAWING: {
    id: MAP_START_DRAWING,
    ignore: true
  },
  MAP_END_DRAWING: {
    id: MAP_END_DRAWING
  },

  FETCH_DETAIL: {
    id: 'FETCH_DETAIL',
    ignore: true
  },
  SHOW_DETAIL: {
    id: 'SHOW_DETAIL'
  },
  DETAIL_FULLSCREEN: {
    id: 'DETAIL_FULLSCREEN',
    replace: true
  },

  FETCH_STRAATBEELD_BY_ID: {
    id: 'FETCH_STRAATBEELD_BY_ID'
  },
  FETCH_STRAATBEELD_BY_HOTSPOT: {
    id: 'FETCH_STRAATBEELD_BY_HOTSPOT',
    ignore: true
  },
  FETCH_STRAATBEELD_BY_LOCATION: {
    id: 'FETCH_STRAATBEELD_BY_LOCATION'
  },
  SHOW_STRAATBEELD_INITIAL: {
    id: 'SHOW_STRAATBEELD_INITIAL',
    ignore: true
  },
  SHOW_STRAATBEELD_SUBSEQUENT: {
    id: 'SHOW_STRAATBEELD_SUBSEQUENT',
    replace: true
  },
  STRAATBEELD_FULLSCREEN: {
    id: 'STRAATBEELD_FULLSCREEN'
  },
  HIDE_STRAATBEELD: {
    id: 'HIDE_STRAATBEELD',
    ignore: true
  },
  SET_STRAATBEELD_ORIENTATION: {
    id: 'SET_STRAATBEELD_ORIENTATION',
    replace: true
  },
  SET_STRAATBEELD_HISTORY: {
    id: 'SET_STRAATBEELD_HISTORY'
  },

  FETCH_DATA_SELECTION: {
    id: 'FETCH_DATA_SELECTION',
    ignore: true
  },
  RESET_DATA_SELECTION: {
    id: 'RESET_DATA_SELECTION',
    ignore: true
  },
  SHOW_DATA_SELECTION: {
    id: 'SHOW_DATA_SELECTION'
  },
  NAVIGATE_DATA_SELECTION: {
    id: 'NAVIGATE_DATA_SELECTION'
  },
  SET_DATA_SELECTION_VIEW: {
    id: 'SET_DATA_SELECTION_VIEW'
  },

  SHOW_HOME: {
    id: 'SHOW_HOME'
  },
  SHOW_PAGE: {
    id: 'SHOW_PAGE'
  },

  APPLY_FILTERS: {
    id: 'APPLY_FILTERS',
    ignore: true
  },
  EMPTY_FILTERS: {
    id: 'EMPTY_FILTERS',
    ignore: true
  }
};
