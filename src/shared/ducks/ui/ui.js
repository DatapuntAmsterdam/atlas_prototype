import PAGES from '../../../pages';

export const HIDE_EMBED_PREVIEW = 'HIDE_EMBED_PREVIEW';
export const HIDE_MAP_PANEL = 'HIDE_MAP_PANEL';
export const HIDE_PRINT = 'HIDE_PRINT';
const HIDE_STRAATBEELD = 'HIDE_STRAATBEELD';
export const SET_MAP_FULLSCREEN = 'SET_MAP_FULLSCREEN';
export const SHOW_EMBED_PREVIEW = 'SHOW_EMBED_PREVIEW';
const SHOW_MAP = 'SHOW_MAP';
export const SHOW_MAP_PANEL = 'SHOW_MAP_PANEL';
export const SHOW_PRINT = 'SHOW_PRINT';
export const TOGGLE_MAP_FULLSCREEN = 'TOGGLE_MAP_FULLSCREEN';
export const TOGGLE_MAP_PANEL = 'TOGGLE_MAP_PANEL';
export const TOGGLE_MAP_PANEL_HANDLE = 'TOGGLE_MAP_PANEL_HANDLE';
const TOGGLE_STRAATBEELD_FULLSCREEN = 'TOGGLE_STRAATBEELD_FULLSCREEN';
const SWITCH_PAGE = 'SWITCH_PAGE';
const SWITCH_MODE = 'SWITCH_MODE';

export const MAP_MODE = {
  NORMAL: 'NORMAL',
  PANORAMA: 'PANORAMA'
};

const initialState = {
  isMapFullscreen: false,
  isMapPanelVisible: false,
  isMapPanelHandleVisible: true,
  // eslint-disable-next-line max-len
  mapMode: MAP_MODE.NORMAL, // Overwritten by modules/atlas/services/routing/state-url-conversion.factory.js:250
  prevPage: undefined,
  // eslint-disable-next-line max-len
  page: PAGES.HOME // Overwritten by modules/atlas/services/routing/state-url-conversion.factory.js:250
};

const handleFullScreenChange = (state, doMaximize) => {
  const isFullscreen = state.page === PAGES.KAART;

  if (isFullscreen === doMaximize) {
    return state;
  }

  if (doMaximize === false) {
    // minimize
    if (state.prevPage) {
      return {
        ...state,
        prevPage: state.page,
        page: state.prevPage
      };
    }
    return {
      ...state,
      page: PAGES.HOME
    };
  }

  // maximize
  return {
    ...state,
    prevPage: state.page,
    page: PAGES.KAART
  };
};

export default function UiReducer(state = initialState, action) {
  switch (action.type) {
    case SWITCH_MODE:
      return {
        ...state,
        mapMode: action.payload
      };

    case HIDE_EMBED_PREVIEW:
      return {
        ...state,
        isEmbedPreview: false
      };

    case HIDE_MAP_PANEL:
      return {
        ...state,
        isMapPanelVisible: false
      };

    case HIDE_PRINT:
      return {
        ...state,
        isPrintMode: false
      };

    case HIDE_STRAATBEELD:
      if (state.page === PAGES.PANORAMA || state.page === PAGES.KAART_PANORAMA) {
        if (state.prevPage) {
          // return to prev page unless that is also a panorama page
          if (state.prevPage === PAGES.PANORAMA || state.prevPage === PAGES.KAART_PANORAMA) {
            return {
              ...state,
              prevPage: state.page,
              page: PAGES.KAART
            };
          }
          return {
            ...state,
            prevPage: state.page,
            page: state.prevPage
          };
        }
        return {
          ...state,
          page: PAGES.HOME
        };
      }
      return {
        ...state
      };

    case SHOW_EMBED_PREVIEW:
      return {
        ...state,
        isEmbedPreview: true
      };

    case SHOW_MAP_PANEL:
      return {
        ...state,
        isMapPanelVisible: true
      };

    case SHOW_MAP:
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

    case SWITCH_PAGE:
      return {
        ...state,
        prevPage: state.page,
        page: action.payload
      };

    case TOGGLE_MAP_FULLSCREEN:
      return handleFullScreenChange(state, state.page !== PAGES.KAART);

    case SET_MAP_FULLSCREEN:
      return handleFullScreenChange(state, action.payload.isMapFullscreen);

    case TOGGLE_STRAATBEELD_FULLSCREEN:
      if (state.page === PAGES.KAART_PANORAMA) {
        return {
          ...state,
          prevPage: state.page,
          page: PAGES.PANORAMA
        };
      }
      return {
        ...state,
        prevPage: state.page,
        page: PAGES.KAART_PANORAMA
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

export const switchMode = (mode) => ({ type: SWITCH_MODE, payload: mode });
export const showMap = () => ({ type: SHOW_MAP });
export const hideMapPanel = () => ({ type: HIDE_MAP_PANEL });
export const hideStraatbeeld = () => ({ type: HIDE_STRAATBEELD });
export const showMapPanel = () => ({ type: SHOW_MAP_PANEL });
export const toggleMapFullscreen = () => ({ type: TOGGLE_MAP_FULLSCREEN });
export const setMapFullscreen = (payload) => ({ type: SET_MAP_FULLSCREEN, payload });
export const toggleMapPanel = () => ({ type: TOGGLE_MAP_PANEL });
export const toggleMapPanelHandle = () => ({ type: TOGGLE_MAP_PANEL_HANDLE });
export const toggleStraatbeeldFullscreen = () => ({ type: TOGGLE_STRAATBEELD_FULLSCREEN });
export const switchPage = (page) => ({ type: SWITCH_PAGE, payload: page });
