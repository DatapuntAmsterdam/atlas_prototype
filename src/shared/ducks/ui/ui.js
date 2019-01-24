import { createSelector } from 'reselect';
import {
  isDataSelectionPage,
  isDatasetPage,
  isDatasetDetailPage,
  isHomepage,
  isPanoPage
} from '../../../store/redux-first-router/selectors';
import paramsRegistry from '../../../store/params-registry';

const REDUCER_KEY = 'ui';
export { REDUCER_KEY as UI };
export const HIDE_EMBED_PREVIEW = `${REDUCER_KEY}/HIDE_EMBED_PREVIEW`;
export const HIDE_PRINT = `${REDUCER_KEY}/HIDE_PRINT`;
export const SHOW_EMBED_PREVIEW = `${REDUCER_KEY}/SHOW_EMBED_PREVIEW`;
export const SHOW_PRINT = `${REDUCER_KEY}/SHOW_PRINT`;
export const TOGGLE_MAP_PANEL_HANDLE = `${REDUCER_KEY}/TOGGLE_MAP_PANEL_HANDLE`;
export const SET_VIEW_MODE = `${REDUCER_KEY}/SET_VIEW_MODE`;

export const VIEW_MODE = {
  MAP: 'kaart',
  SPLIT: 'gesplitst',
  FULL: 'volledig'
};

export const initialState = {
  isMapPanelHandleVisible: true,
  isEmbedPreview: false,
  isEmbed: false,
  isPrintMode: false,
  viewMode: VIEW_MODE.FULL
};

export default function UiReducer(state = initialState, action) {
  const enrichedState = {
    ...state,
    ...paramsRegistry.getStateFromQueries(REDUCER_KEY, action)
  };

  switch (action.type) {
    case HIDE_EMBED_PREVIEW:
      return {
        ...enrichedState,
        isEmbedPreview: false,
        isEmbed: false
      };

    case HIDE_PRINT:
      return {
        ...enrichedState,
        isPrintMode: false
      };

    case SHOW_EMBED_PREVIEW:
      return {
        ...enrichedState,
        isEmbedPreview: true
      };

    case SHOW_PRINT:
      return {
        ...enrichedState,
        isPrintMode: true
      };

    case SET_VIEW_MODE:
      return {
        ...enrichedState,
        viewMode: action.payload
      };

    case TOGGLE_MAP_PANEL_HANDLE:
      return {
        ...enrichedState,
        isMapPanelHandleVisible: !enrichedState.isMapPanelHandleVisible
      };

    default:
      return enrichedState;
  }
}

// Todo: wire these actions properly when ui reducer is obsolete
export const showEmbedPreview = () => ({
  type: SHOW_EMBED_PREVIEW,
  meta: {
    tracking: true
  }
});
export const showPrintMode = () => ({
  type: SHOW_PRINT,
  meta: {
    tracking: true
  }
});
export const setViewMode = (payload, tracking = true) => ({
  type: SET_VIEW_MODE,
  payload,
  meta: { tracking }
});
export const hidePrintMode = () => ({ type: HIDE_PRINT });
export const hideEmbedMode = () => ({ type: HIDE_EMBED_PREVIEW });
export const toggleMapPanelHandle = () => ({ type: TOGGLE_MAP_PANEL_HANDLE });

// Selectors
const getUIState = (state) => state[REDUCER_KEY];
export const isEmbedded = createSelector(getUIState, (ui) => ui.isEmbed);
export const isEmbedPreview = createSelector(getUIState, (ui) => ui.isEmbedPreview);
export const isPrintMode = createSelector(getUIState, (ui) => ui.isPrintMode);
export const getViewMode = createSelector(getUIState, (ui) => ui.viewMode);
export const isPrintOrEmbedMode = createSelector(
  isEmbedded,
  isPrintMode,
  isEmbedPreview,
  (embedded, print, preview) =>
    Boolean(embedded || print || preview));
export const isMapLayersVisible = createSelector(getUIState, (ui) => ui.isMapLayersVisible);
export const isMapPanelHandleVisible =
  createSelector(getUIState, (ui) => ui.isMapPanelHandleVisible);

export const isMapPage = createSelector(isHomepage, getViewMode, (homePage, viewMode) => (
  homePage && viewMode === VIEW_MODE.MAP
));
export const isMapActive = createSelector(
  getViewMode, isMapPage,
  (viewMode, isMapPageActive) => viewMode === VIEW_MODE.MAP || isMapPageActive
);
export const hasPrintMode = createSelector(
  isDataSelectionPage,
  isDatasetPage,
  isDatasetDetailPage,
  isHomepage,
  isMapActive,
  getViewMode,
  (
    dataSelectionPage,
    datasetPage,
    datasetDetailPage,
    dataDetailPage,
    homePage,
    mapActive,
    viewMode
  ) =>
    (!dataSelectionPage || viewMode === VIEW_MODE.SPLIT || viewMode === VIEW_MODE.MAP) &&
    (!datasetPage || datasetDetailPage) &&
    (!homePage || mapActive)
);
export const isPrintModeLandscape = createSelector(
  isPrintMode,
  isPanoPage,
  isMapPage,
  getViewMode,
  (printMode, panoPageActive, mapPageActive, viewMode) =>
    (printMode &&
      (panoPageActive || mapPageActive || (viewMode === VIEW_MODE.MAP))
    )
);
