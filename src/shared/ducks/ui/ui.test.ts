import uiReducer, {
  hasEmbedMode,
  hasPrintMode,
  hideEmbedPreview,
  hidePrintMode,
  HIDE_EMBED_PREVIEW,
  HIDE_PRINT,
  initialState,
  isMapLinkVisible,
  isMapPage,
  isPanoFullscreen,
  isPrintModeLandscape,
  setViewMode,
  SET_VIEW_MODE,
  sharePage,
  SHARE_PAGE,
  showEmbedPreview,
  showPrintMode,
  SHOW_EMBED_PREVIEW,
  SHOW_PRINT,
  toggleMapPanelHandle,
  TOGGLE_MAP_PANEL_HANDLE,
  UiState,
  ViewMode,
} from './ui'

describe('uiReducer', () => {
  let state

  beforeEach(() => {
    state = initialState
  })

  it('should set the initial state', () => {
    expect(state).toEqual(initialState)
  })

  it('should set the print mode to true', () => {
    expect(uiReducer(state, showPrintMode())).toEqual({
      ...state,
      isPrintMode: true,
    })
  })

  it('should set the show embed preview state to true', () => {
    expect(uiReducer(state, showEmbedPreview())).toEqual({
      ...state,
      isEmbedPreview: true,
    })
  })

  it('should set the show embed preview state to false', () => {
    expect(uiReducer(state, hideEmbedPreview())).toEqual({
      ...state,
      isEmbedPreview: false,
    })
  })

  it('should set the isPrint state to false', () => {
    expect(uiReducer(state, hidePrintMode())).toEqual({
      ...state,
      isPrintMode: false,
    })
  })

  it('should set the viewMode', () => {
    expect(state.viewMode).toBe(ViewMode.Split)
    expect(uiReducer(state, setViewMode(ViewMode.Map))).toEqual({
      ...state,
      viewMode: ViewMode.Map,
    })
  })

  it('should toggle the map panel handle ', () => {
    expect(state.isMapPanelHandleVisible).toBe(true)
    expect(uiReducer(state, toggleMapPanelHandle())).toEqual({
      ...state,
      isMapPanelHandleVisible: false,
    })
  })
})

describe('UI action creators', () => {
  it('should creat show embed preview action', () => {
    expect(showEmbedPreview()).toEqual({
      type: SHOW_EMBED_PREVIEW,
      meta: {
        tracking: true,
      },
    })
  })

  it('should create the show print mode action', () => {
    expect(showPrintMode()).toEqual({
      type: SHOW_PRINT,
      meta: {
        tracking: true,
      },
    })
  })

  it('should create the set view mode action', () => {
    expect(setViewMode(ViewMode.Full, false)).toEqual({
      type: SET_VIEW_MODE,
      payload: ViewMode.Full,
      meta: {
        tracking: false,
      },
    })

    expect(setViewMode(ViewMode.Split)).toEqual({
      type: SET_VIEW_MODE,
      payload: ViewMode.Split,
      meta: {
        tracking: true,
      },
    })
  })

  it('should create the hide print mode action', () => {
    expect(hidePrintMode()).toEqual({
      type: HIDE_PRINT,
      meta: {
        tracking: true,
      },
    })
  })

  it('should create the hide embed mode action', () => {
    expect(hideEmbedPreview()).toEqual({
      type: HIDE_EMBED_PREVIEW,
      meta: {
        tracking: true,
      },
    })
  })

  it('should create the share page action', () => {
    expect(sharePage()).toEqual({
      type: SHARE_PAGE,
      meta: {
        tracking: true,
      },
    })
  })

  it('should create the toggle map panel handle action', () => {
    expect(toggleMapPanelHandle()).toEqual({
      type: TOGGLE_MAP_PANEL_HANDLE,
    })
  })
})

describe('UI selectors', () => {
  it('should select the isMapLinkVisible', () => {
    const mockParameters = {
      isMapLinkVisible: false,
    }
    const selected = isMapLinkVisible.resultFunc(mockParameters as UiState)
    expect(selected).toEqual(mockParameters.isMapLinkVisible)
  })

  describe('isMapPage selector', () => {
    it('should return false when not on the map page', () => {
      const mockParameters = {
        isDataPage: false,
        viewMode: ViewMode.Map,
      }
      const selected = isMapPage.resultFunc(mockParameters.isDataPage, mockParameters.viewMode)
      expect(selected).toEqual(false)
    })

    it('should return true when view mode is map', () => {
      const mockParameters = {
        isDataPage: true,
        viewMode: ViewMode.Map,
      }
      const selected = isMapPage.resultFunc(mockParameters.isDataPage, mockParameters.viewMode)
      expect(selected).toEqual(true)
    })

    it('should return false when view mode is not map', () => {
      const mockParameters = {
        isDataPage: true,
        viewMode: ViewMode.Split,
      }
      const selected = isMapPage.resultFunc(mockParameters.isDataPage, mockParameters.viewMode)
      expect(selected).toEqual(false)
    })
  })

  describe('isPanoFullscreen selector', () => {
    it('should return true when map is in the full mode on the pano page', () => {
      const mockParameters = {
        viewMode: ViewMode.Full,
        isPanoPage: true,
      }
      const selected = isPanoFullscreen.resultFunc(
        mockParameters.viewMode,
        mockParameters.isPanoPage,
      )
      expect(selected).toEqual(true)
    })

    it('should return false when map is in the full mode but on the pano page', () => {
      const mockParameters = {
        viewMode: ViewMode.Full,
        isPanoPage: false,
      }
      const selected = isPanoFullscreen.resultFunc(
        mockParameters.viewMode,
        mockParameters.isPanoPage,
      )
      expect(selected).toEqual(false)
    })
  })

  describe('hasPrintMode selector', () => {
    const mockParameters = {
      dataSelectionPage: false,
      datasetPage: false,
      datasetDetailPage: false,
      dataPage: false,
      mapActive: false,
      panoPageActive: false,
      homePageActive: false,
      viewMode: ViewMode.Map,
    }

    it('should return true when pano page is active', () => {
      mockParameters.panoPageActive = true
      const selected = hasPrintMode.resultFunc(
        mockParameters.dataSelectionPage,
        mockParameters.datasetPage,
        mockParameters.datasetDetailPage,
        mockParameters.dataPage,
        mockParameters.mapActive,
        mockParameters.panoPageActive,
        mockParameters.homePageActive,
        mockParameters.viewMode,
      )
      expect(selected).toEqual(true)
    })

    it('should return true when map page is active', () => {
      mockParameters.dataSelectionPage = true
      mockParameters.mapActive = true
      const selected = hasPrintMode.resultFunc(
        mockParameters.dataSelectionPage,
        mockParameters.datasetPage,
        mockParameters.datasetDetailPage,
        mockParameters.dataPage,
        mockParameters.mapActive,
        mockParameters.panoPageActive,
        mockParameters.homePageActive,
        mockParameters.viewMode,
      )
      expect(selected).toEqual(true)
    })

    it('should return true when on dataset detail page', () => {
      mockParameters.datasetDetailPage = true
      mockParameters.datasetPage = true
      mockParameters.dataPage = true
      const selected = hasPrintMode.resultFunc(
        mockParameters.dataSelectionPage,
        mockParameters.datasetPage,
        mockParameters.datasetDetailPage,
        mockParameters.dataPage,
        mockParameters.mapActive,
        mockParameters.panoPageActive,
        mockParameters.homePageActive,
        mockParameters.viewMode,
      )
      expect(selected).toEqual(true)
    })

    it('should return true when on detail page', () => {
      mockParameters.viewMode = ViewMode.Split
      const selected = hasPrintMode.resultFunc(
        mockParameters.dataSelectionPage,
        mockParameters.datasetPage,
        mockParameters.datasetDetailPage,
        mockParameters.dataPage,
        mockParameters.mapActive,
        mockParameters.panoPageActive,
        mockParameters.homePageActive,
        mockParameters.viewMode,
      )
      expect(selected).toEqual(true)
    })

    it('should return false when on the home page', () => {
      mockParameters.homePageActive = true
      const selected = hasPrintMode.resultFunc(
        mockParameters.dataSelectionPage,
        mockParameters.datasetPage,
        mockParameters.datasetDetailPage,
        mockParameters.dataPage,
        mockParameters.mapActive,
        mockParameters.panoPageActive,
        mockParameters.homePageActive,
        mockParameters.viewMode,
      )
      expect(selected).toEqual(false)
    })
  })

  describe('hasEmbedMode selector', () => {
    const mockParameters = {
      mapActive: false,
      panoPage: false,
      panoFullscreen: false,
      dataSelectionPage: false,
    }

    it('should return true when on a map page', () => {
      mockParameters.mapActive = true
      const selected = hasEmbedMode.resultFunc(
        mockParameters.mapActive,
        mockParameters.panoPage,
        mockParameters.panoFullscreen,
        mockParameters.dataSelectionPage,
      )
      expect(selected).toEqual(true)
    })

    it('should return true when on a pano page in full screen', () => {
      mockParameters.panoPage = true
      mockParameters.panoFullscreen = true
      const selected = hasEmbedMode.resultFunc(
        mockParameters.mapActive,
        mockParameters.panoPage,
        mockParameters.panoFullscreen,
        mockParameters.dataSelectionPage,
      )
      expect(selected).toEqual(true)
    })
  })

  describe('isPrintModeLandscape selector', () => {
    let mockParameters

    beforeEach(() => {
      mockParameters = {
        printMode: true,
        panoPageActive: false,
        mapPageActive: false,
        viewMode: ViewMode.Map,
      }
    })

    it('should return false when not in print mode', () => {
      mockParameters.printMode = false
      const selected = isPrintModeLandscape.resultFunc(
        mockParameters.printMode,
        mockParameters.panoPageActive,
        mockParameters.mapPageActive,
        '',
        mockParameters.viewMode,
      )
      expect(selected).toEqual(false)
    })

    it('should return true when view mode is map', () => {
      const selected = isPrintModeLandscape.resultFunc(
        mockParameters.printMode,
        mockParameters.panoPageActive,
        mockParameters.mapPageActive,
        '',
        mockParameters.viewMode,
      )
      expect(selected).toEqual(true)
    })
  })
})
