import { createSelector } from 'reselect'
import {
  isDataPage,
  isDataSelectionPage,
  isDatasetDetailPage,
  isDatasetPage,
  isPanoPage,
  isHomepage,
} from '../../../store/redux-first-router/selectors'
import paramsRegistry from '../../../store/params-registry'
import { getFileName } from '../files/selectors'

const REDUCER_KEY = 'ui'
export { REDUCER_KEY as UI }
export const HIDE_EMBED_PREVIEW = `${REDUCER_KEY}/HIDE_EMBED_PREVIEW`
export const HIDE_PRINT = `${REDUCER_KEY}/HIDE_PRINT`
export const SHOW_EMBED_PREVIEW = `${REDUCER_KEY}/SHOW_EMBED_PREVIEW`
export const SHOW_PRINT = `${REDUCER_KEY}/SHOW_PRINT`
export const TOGGLE_MAP_PANEL_HANDLE = `${REDUCER_KEY}/TOGGLE_MAP_PANEL_HANDLE`
export const SET_VIEW_MODE = `${REDUCER_KEY}/SET_VIEW_MODE`
export const SHARE_PAGE = `${REDUCER_KEY}/SHARE_PAGE`

export const VIEW_MODE = {
  MAP: 'kaart',
  SPLIT: 'gesplitst',
  FULL: 'volledig',
}

export const SHARE_OPTIONS = {
  FACEBOOK: 'facebook',
  TWITTER: 'twitter',
  LINKEDIN: 'linkedin',
  EMAIL: 'email',
  PRINT: 'printversie',
}

export const initialState = {
  isMapPanelHandleVisible: true,
  isEmbedPreview: false,
  isEmbed: false,
  isPrintMode: false,
  viewMode: VIEW_MODE.SPLIT,
  isMapLinkVisible: true,
}

export default function UiReducer(state = initialState, action) {
  const enrichedState = {
    ...state,
    ...paramsRegistry.getStateFromQueries(REDUCER_KEY, action),
  }

  switch (action.type) {
    case HIDE_EMBED_PREVIEW:
      return {
        ...enrichedState,
        isEmbedPreview: false,
        isEmbed: false,
      }

    case HIDE_PRINT:
      return {
        ...enrichedState,
        isPrintMode: false,
      }

    case SHOW_EMBED_PREVIEW:
      return {
        ...enrichedState,
        isEmbedPreview: true,
      }

    case SHOW_PRINT:
      return {
        ...enrichedState,
        isPrintMode: true,
      }

    case SET_VIEW_MODE:
      return {
        ...enrichedState,
        viewMode: action.payload,
      }

    case TOGGLE_MAP_PANEL_HANDLE:
      return {
        ...enrichedState,
        isMapPanelHandleVisible: !enrichedState.isMapPanelHandleVisible,
      }

    default:
      return enrichedState
  }
}

// Todo: wire these actions properly when ui reducer is obsolete
export const showEmbedPreview = () => ({
  type: SHOW_EMBED_PREVIEW,
  meta: {
    tracking: true,
  },
})
export const showPrintMode = () => ({
  type: SHOW_PRINT,
  meta: {
    tracking: true,
  },
})
export const setViewMode = (payload, tracking = true) => ({
  type: SET_VIEW_MODE,
  payload,
  meta: { tracking },
})
export const hidePrintMode = () => ({
  type: HIDE_PRINT,
  meta: {
    tracking: true,
  },
})
export const hideEmbedMode = () => ({
  type: HIDE_EMBED_PREVIEW,
  meta: {
    tracking: true,
  },
})
export const sharePage = payload => ({
  type: SHARE_PAGE,
  meta: {
    tracking: payload,
  },
})
export const toggleMapPanelHandle = () => ({ type: TOGGLE_MAP_PANEL_HANDLE })

// Selectors
const getUIState = state => state[REDUCER_KEY]
export const isEmbedded = createSelector(
  getUIState,
  ui => ui.isEmbed,
)
export const isEmbedPreview = createSelector(
  getUIState,
  ui => ui.isEmbedPreview,
)
export const isPrintMode = createSelector(
  getUIState,
  ui => ui.isPrintMode,
)
export const getViewMode = createSelector(
  getUIState,
  ui => ui.viewMode,
)
export const isPrintOrEmbedMode = createSelector(
  isEmbedded,
  isPrintMode,
  isEmbedPreview,
  (embedded, print, preview) => Boolean(embedded || print || preview),
)
export const hasOverflowScroll = createSelector(
  getViewMode,
  isDataSelectionPage,
  (viewMode, isDataSelection) => viewMode === VIEW_MODE.FULL && isDataSelection,
)
export const isMapLayersVisible = createSelector(
  getUIState,
  ui => ui.isMapLayersVisible,
)
export const isMapPanelHandleVisible = createSelector(
  getUIState,
  ui => ui.isMapPanelHandleVisible,
)
export const isMapLinkVisible = createSelector(
  getUIState,
  ui => ui.isMapLinkVisible,
)

export const isMapPage = createSelector(
  isDataPage,
  getViewMode,
  (dataPage, viewMode) => dataPage && viewMode === VIEW_MODE.MAP,
)
export const isMapActive = createSelector(
  getViewMode,
  isMapPage,
  (viewMode, isMapPageActive) => viewMode === VIEW_MODE.MAP || isMapPageActive,
)
export const isPanoFullscreen = createSelector(
  getViewMode,
  isPanoPage,
  (viewMode, isPano) => viewMode === VIEW_MODE.FULL && isPano,
)
export const hasPrintMode = createSelector(
  isDataSelectionPage,
  isDatasetPage,
  isDatasetDetailPage,
  isDataPage,
  isMapActive,
  isPanoPage,
  isHomepage,
  getViewMode,
  (
    dataSelectionPage,
    datasetPage,
    datasetDetailPage,
    dataPage,
    mapActive,
    panoPageActive,
    homePageActive,
    viewMode,
  ) =>
    !homePageActive &&
    (((!dataSelectionPage || viewMode === VIEW_MODE.SPLIT || viewMode === VIEW_MODE.MAP) &&
      (!datasetPage || datasetDetailPage) &&
      (dataPage || mapActive || viewMode === VIEW_MODE.SPLIT)) ||
      panoPageActive ||
      datasetPage),
)

export const hasEmbedMode = createSelector(
  isMapActive,
  isPanoPage,
  isPanoFullscreen,
  isDataSelectionPage,
  (mapActive, panoPage, panoFullscreen, dataSelectionPage) =>
    (mapActive && !panoPage && !dataSelectionPage) || (panoPage && panoFullscreen),
)

export const isPrintModeLandscape = createSelector(
  isPrintMode,
  isPanoPage,
  isMapPage,
  getFileName,
  getViewMode,
  (printMode, panoPageActive, mapPageActive, fileName, viewMode) =>
    printMode && (panoPageActive || mapPageActive || !!fileName || viewMode === VIEW_MODE.MAP),
)
