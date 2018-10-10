import UiReducer, {
  setMapFullscreen,
  toggleMapFullscreen,
  toggleMapPanel,
  toggleMapPanelHandle,
  SHOW_PRINT,
  HIDE_PRINT,
  SHOW_EMBED_PREVIEW,
  HIDE_EMBED_PREVIEW
} from './ui';

describe('UiReducer', () => {
  let state;

  beforeEach(() => {
    state = UiReducer(undefined, {});
  });

  it('should set the initial state', () => {
    expect(state).toEqual({
      isMapPanelVisible: false,
      isMapPanelHandleVisible: true,
      isMapFullscreen: false
    });
  });

  it('should toggle the map panel', () => {
    const newState = UiReducer(state, toggleMapPanel());
    expect(newState).toEqual({
      ...state,
      isMapPanelVisible: true
    });
    expect(UiReducer(newState, toggleMapPanel())).toEqual({
      ...state,
      isMapPanelVisible: false
    });
  });

  it('should set the fullscreen state of the map', () => {
    const newState = UiReducer(state, setMapFullscreen({
      isMapFullscreen: true
    }));
    expect(newState).toEqual({
      ...state,
      isMapFullscreen: true
    });
    expect(UiReducer(newState, setMapFullscreen({
      isMapFullscreen: false
    }))).toEqual({
      ...state,
      isMapFullscreen: false
    });
  });

  it('should toggle the map panel handle', () => {
    const newState = UiReducer(state, toggleMapPanelHandle());
    expect(newState).toEqual({
      ...state,
      isMapPanelHandleVisible: false
    });
    expect(UiReducer(newState, toggleMapPanelHandle())).toEqual({
      ...state,
      isMapPanelHandleVisible: true
    });
  });

  it('should set the print mode to true', () => {
    expect(UiReducer(state, {
      type: SHOW_PRINT
    })).toEqual({
      ...state,
      isPrintMode: true
    });
  });

  it('should set the show embed preview state to true', () => {
    expect(UiReducer(state, {
      type: SHOW_EMBED_PREVIEW
    })).toEqual({
      ...state,
      isEmbedPreview: true
    });
  });

  it('should set the show embed preview state to false', () => {
    expect(UiReducer(state, {
      type: HIDE_EMBED_PREVIEW
    })).toEqual({
      ...state,
      isEmbedPreview: false
    });
  });

  it('should set the isPrint state to false', () => {
    expect(UiReducer(state, {
      type: HIDE_PRINT
    })).toEqual({
      ...state,
      isPrintMode: false
    });
  });

  it('should toggle the map fullscreen', () => {
    const newState = UiReducer(state, toggleMapFullscreen());
    expect(newState).toEqual({
      ...state,
      isMapFullscreen: true
    });
    expect(UiReducer(newState, toggleMapFullscreen())).toEqual({
      ...state,
      isMapFullscreen: false
    });
  });
});
