import { routing } from '../../../app/routes';

export const HIDE_EMBED_PREVIEW = 'HIDE_EMBED_PREVIEW';
export const HIDE_PRINT = 'HIDE_PRINT';
export const SET_MAP_FULLSCREEN = 'SET_MAP_FULLSCREEN';
export const SHOW_EMBED_PREVIEW = 'SHOW_EMBED_PREVIEW';
export const SHOW_PRINT = 'SHOW_PRINT';
export const TOGGLE_MAP_FULLSCREEN = 'TOGGLE_MAP_FULLSCREEN';
export const TOGGLE_MAP_PANEL = 'TOGGLE_MAP_PANEL';
export const TOGGLE_MAP_PANEL_HANDLE = 'TOGGLE_MAP_PANEL_HANDLE';

const initialState = {
  isMapFullscreen: false,
  isMapPanelVisible: false,
  isMapPanelHandleVisible: true
};

export default function UiReducer(state = initialState, action) {
  switch (action.type) {
    case HIDE_EMBED_PREVIEW:
      return {
        ...state,
        isEmbedPreview: false
      };

    case HIDE_PRINT:
      return {
        ...state,
        isPrintMode: false
      };

    case SHOW_EMBED_PREVIEW:
      return {
        ...state,
        isEmbedPreview: true
      };

    case routing.map.type:
      return {
        ...state,
        isMapPanelVisible: true,
        isMapFullscreen: true
      };

    case SHOW_PRINT:
      return {
        ...state,
        isPrintMode: true
      };

    case TOGGLE_MAP_FULLSCREEN:
      return {
        ...state,
        isMapFullscreen: !state.isMapFullscreen
      };

    case SET_MAP_FULLSCREEN:
      return {
        ...state,
        isMapFullscreen: action.payload.isMapFullscreen
      };

    case TOGGLE_MAP_PANEL:
      return {
        ...state,
        isMapPanelVisible: !state.isMapPanelVisible
      };

    case TOGGLE_MAP_PANEL_HANDLE:
      return {
        ...state,
        isMapPanelHandleVisible: !state.isMapPanelHandleVisible
      };

    default:
      return state;
  }
}

export const toggleMapFullscreen = () => ({ type: TOGGLE_MAP_FULLSCREEN });
export const setMapFullscreen = (payload) => ({ type: SET_MAP_FULLSCREEN, payload });
export const toggleMapPanel = () => ({ type: TOGGLE_MAP_PANEL });
export const toggleMapPanelHandle = () => ({ type: TOGGLE_MAP_PANEL_HANDLE });
