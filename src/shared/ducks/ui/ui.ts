import { createSelector } from 'reselect'
import { typedAction } from '../../../app/utils/typedAction'
import type { RootState } from '../../../reducers/root'
import paramsRegistry from '../../../store/params-registry'
import {
  isDataPage,
  isDataSelectionPage,
  isDatasetDetailPage,
  isDatasetPage,
  isHomepage,
  isPanoPage,
} from '../../../store/redux-first-router/selectors'

export const REDUCER_KEY = 'ui'

export const HIDE_EMBED_PREVIEW = `ui/HIDE_EMBED_PREVIEW`
export const SHOW_PRINT = `ui/SHOW_PRINT`
export const HIDE_PRINT = `ui/HIDE_PRINT`
export const SHOW_EMBED_PREVIEW = `ui/SHOW_EMBED_PREVIEW`
export const TOGGLE_MAP_PANEL_HANDLE = `ui/TOGGLE_MAP_PANEL_HANDLE`
export const SET_VIEW_MODE = `ui/SET_VIEW_MODE`
export const SHARE_PAGE = `ui/SHARE_PAGE`

export enum ViewMode {
  Map = 'kaart',
  Split = 'gesplitst',
  Full = 'volledig',
}

export const showEmbedPreview = () => typedAction(SHOW_EMBED_PREVIEW, undefined, { tracking: true })
export const hideEmbedPreview = () => typedAction(HIDE_EMBED_PREVIEW, undefined, { tracking: true })
export const showPrintMode = () => typedAction(SHOW_PRINT, undefined, { tracking: true })
export const hidePrintMode = () => typedAction(HIDE_PRINT, undefined, { tracking: true })
export const setViewMode = (viewMode: ViewMode, tracking = true) =>
  typedAction(SET_VIEW_MODE, viewMode, { tracking })
export const sharePage = () => typedAction(SHARE_PAGE, undefined, { tracking: true })
export const toggleMapPanelHandle = () => typedAction(TOGGLE_MAP_PANEL_HANDLE)

type UiAction = ReturnType<
  | typeof showEmbedPreview
  | typeof hideEmbedPreview
  | typeof showPrintMode
  | typeof hidePrintMode
  | typeof setViewMode
  | typeof sharePage
  | typeof toggleMapPanelHandle
>

export interface UiState {
  isMapPanelHandleVisible: boolean
  isEmbedPreview: boolean
  isEmbed: boolean
  isPrintMode: boolean
  viewMode: ViewMode
  isMapLinkVisible: boolean
}

export const initialState: UiState = {
  isMapPanelHandleVisible: true,
  isEmbedPreview: false,
  isEmbed: false,
  isPrintMode: false,
  viewMode: ViewMode.Split,
  isMapLinkVisible: true,
}

export default function uiReducer(state = initialState, action: UiAction): UiState {
  const enrichedState = {
    ...state,
    ...paramsRegistry.getStateFromQueries(REDUCER_KEY, action),
  } as UiState

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

const getUIState = (state: RootState) => state[REDUCER_KEY]

export const isEmbedded = createSelector(getUIState, (ui) => ui.isEmbed)
export const isEmbedPreview = createSelector(getUIState, (ui) => ui.isEmbedPreview)
export const isPrintMode = createSelector(getUIState, (ui) => ui.isPrintMode)
export const getViewMode = createSelector(getUIState, (ui) => ui.viewMode)

export const isPrintOrEmbedMode = createSelector(
  isEmbedded,
  isPrintMode,
  isEmbedPreview,
  (embedded, print, preview) => Boolean(embedded || print || preview),
)

export const hasOverflowScroll = createSelector(
  getViewMode,
  isDataSelectionPage,
  (viewMode, isDataSelection) => viewMode === ViewMode.Full && isDataSelection,
)

export const isMapPanelHandleVisible = createSelector(
  getUIState,
  (ui) => ui.isMapPanelHandleVisible,
)

export const isMapLinkVisible = createSelector(getUIState, (ui) => ui.isMapLinkVisible)

export const isMapPage = createSelector(
  isDataPage,
  getViewMode,
  (dataPage, viewMode) => dataPage && viewMode === ViewMode.Map,
)

export const isMapActive = createSelector(
  getViewMode,
  isMapPage,
  (viewMode, isMapPageActive) => viewMode === ViewMode.Map || isMapPageActive,
)

export const isPanoFullscreen = createSelector(
  getViewMode,
  isPanoPage,
  (viewMode, isPano) => viewMode === ViewMode.Full && isPano,
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
    (((!dataSelectionPage || viewMode === ViewMode.Split || viewMode === ViewMode.Map) &&
      (!datasetPage || datasetDetailPage) &&
      (dataPage || mapActive || viewMode === ViewMode.Split)) ||
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
  getViewMode,
  (printMode, panoPageActive, mapPageActive, viewMode) =>
    printMode && (panoPageActive || mapPageActive || viewMode === ViewMode.Map),
)
