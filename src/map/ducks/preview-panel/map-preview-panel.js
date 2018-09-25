export const MAXIMIZE_MAP_PREVIEW_PANEL = 'MAXIMIZE_MAP_PREVIEW_PANEL';
export const OPEN_MAP_PREVIEW_PANEL = 'OPEN_MAP_PREVIEW_PANEL';
export const CLOSE_MAP_PREVIEW_PANEL = 'CLOSE_MAP_PREVIEW_PANEL';

const initialState = {};

export default function MapPreviewPanelReducer(state = initialState, action) {
  switch (action.type) {
    case OPEN_MAP_PREVIEW_PANEL:
      return {
        ...state,
        isMapPreviewPanelVisible: true
      };

    case CLOSE_MAP_PREVIEW_PANEL:
      return {
        ...state,
        isMapPreviewPanelVisible: false
      };

    default:
      return state;
  }
}

export const openMapPreviewPanel = () => ({ type: OPEN_MAP_PREVIEW_PANEL });
export const closeMapPreviewPanel = () => ({ type: CLOSE_MAP_PREVIEW_PANEL });

// Todo: is this used in a reducer?
export const fetchSearchResults = (location) => ({
  type: {
    id: 'FETCH_SEARCH_RESULTS_BY_LOCATION',
    ignore: true
  },
  payload: [location.latitude, location.longitude]
});
