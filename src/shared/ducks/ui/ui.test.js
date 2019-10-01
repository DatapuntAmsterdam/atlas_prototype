import UiReducer, {
  HIDE_EMBED_PREVIEW,
  HIDE_PRINT,
  SHOW_EMBED_PREVIEW,
  SHOW_PRINT,
  VIEW_MODE,
  initialState,
  SET_VIEW_MODE,
  TOGGLE_MAP_PANEL_HANDLE,
  showEmbedPreview,
  showPrintMode,
  setViewMode,
  hidePrintMode,
  hideEmbedMode,
  sharePage,
  SHARE_PAGE,
  toggleMapPanelHandle,
  isMapLayersVisible,
  isMapPage,
  isPanoFullscreen,
  hasPrintMode,
  hasEmbedMode,
  isPrintModeLandscape,
  isMapLinkVisible,
} from './ui'

describe('UiReducer', () => {
  let state

  beforeEach(() => {
    state = UiReducer(undefined, {})
  })

  it('should set the initial state', () => {
    expect(state).toEqual(initialState)
  })

  it('should set the print mode to true', () => {
    expect(
      UiReducer(state, {
        type: SHOW_PRINT,
      }),
    ).toEqual({
      ...state,
      isPrintMode: true,
    })
  })

  it('should set the show embed preview state to true', () => {
    expect(
      UiReducer(state, {
        type: SHOW_EMBED_PREVIEW,
      }),
    ).toEqual({
      ...state,
      isEmbedPreview: true,
    })
  })

  it('should set the show embed preview state to false', () => {
    expect(
      UiReducer(state, {
        type: HIDE_EMBED_PREVIEW,
      }),
    ).toEqual({
      ...state,
      isEmbedPreview: false,
    })
  })

  it('should set the isPrint state to false', () => {
    expect(
      UiReducer(state, {
        type: HIDE_PRINT,
      }),
    ).toEqual({
      ...state,
      isPrintMode: false,
    })
  })

  it('should set the viewMode', () => {
    expect(state.viewMode).toBe(VIEW_MODE.SPLIT)
    expect(
      UiReducer(state, {
        type: SET_VIEW_MODE,
        payload: VIEW_MODE.MAP,
      }),
    ).toEqual({
      ...state,
      viewMode: VIEW_MODE.MAP,
    })
  })

  it('should toggle the map panel handle ', () => {
    expect(state.isMapPanelHandleVisible).toBe(true)
    expect(
      UiReducer(state, {
        type: TOGGLE_MAP_PANEL_HANDLE,
      }),
    ).toEqual({
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
    expect(setViewMode(VIEW_MODE.FULL, false)).toEqual({
      type: SET_VIEW_MODE,
      payload: VIEW_MODE.FULL,
      meta: {
        tracking: false,
      },
    })

    expect(setViewMode(VIEW_MODE.SPLIT)).toEqual({
      type: SET_VIEW_MODE,
      payload: VIEW_MODE.SPLIT,
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
    expect(hideEmbedMode()).toEqual({
      type: HIDE_EMBED_PREVIEW,
      meta: {
        tracking: true,
      },
    })
  })

  it('should create the share page action', () => {
    expect(sharePage(true)).toEqual({
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
  it('should select the isMapLayersVisible', () => {
    const mockParameters = {
      isMapLayersVisible: false,
    }
    const selected = isMapLayersVisible.resultFunc(mockParameters)
    expect(selected).toEqual(mockParameters.isMapLayersVisible)
  })

  it('should select the isMapLinkVisible', () => {
    const mockParameters = {
      isMapLinkVisible: false,
    }
    const selected = isMapLinkVisible.resultFunc(mockParameters)
    expect(selected).toEqual(mockParameters.isMapLinkVisible)
  })

  describe('isMapPage selector', () => {
    it('should return false when not on the map page', () => {
      const mockParameters = {
        isDataPage: false,
        viewMode: VIEW_MODE.MAP,
      }
      const selected = isMapPage.resultFunc(mockParameters.isDataPage, mockParameters.viewMode)
      expect(selected).toEqual(false)
    })

    it('should return true when view mode is map', () => {
      const mockParameters = {
        isDataPage: true,
        viewMode: VIEW_MODE.MAP,
      }
      const selected = isMapPage.resultFunc(mockParameters.isDataPage, mockParameters.viewMode)
      expect(selected).toEqual(true)
    })

    it('should return false when view mode is not map', () => {
      const mockParameters = {
        isDataPage: true,
        viewMode: VIEW_MODE.SPLIT,
      }
      const selected = isMapPage.resultFunc(mockParameters.isDataPage, mockParameters.viewMode)
      expect(selected).toEqual(false)
    })
  })

  describe('isPanoFullscreen selector', () => {
    it('should return true when map is in the full mode on the pano page', () => {
      const mockParameters = {
        viewMode: VIEW_MODE.FULL,
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
        viewMode: VIEW_MODE.FULL,
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
      viewMode: VIEW_MODE.MAP,
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
      mockParameters.viewMode = VIEW_MODE.SPLIT
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
        viewMode: VIEW_MODE.MAP,
      }
    })

    it('should return false when not in print mode', () => {
      mockParameters.printMode = false
      const selected = isPrintModeLandscape.resultFunc(
        mockParameters.printMode,
        mockParameters.panoPageActive,
        mockParameters.mapPageActive,
        mockParameters.viewMode,
      )
      expect(selected).toEqual(false)
    })

    it('should return true when view mode is map', () => {
      const selected = isPrintModeLandscape.resultFunc(
        mockParameters.printMode,
        mockParameters.panoPageActive,
        mockParameters.mapPageActive,
        mockParameters.viewMode,
      )
      expect(selected).toEqual(true)
    })
  })
})
