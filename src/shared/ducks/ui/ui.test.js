import UiReducer, {
  HIDE_EMBED_PREVIEW,
  HIDE_PRINT,
  SHOW_EMBED_PREVIEW,
  SHOW_PRINT,
  VIEW_MODE
} from './ui';

describe('UiReducer', () => {
  let state;

  beforeEach(() => {
    state = UiReducer(undefined, {});
  });

  it('should set the initial state', () => {
    expect(state).toEqual({
      isMapPanelHandleVisible: true,
      isEmbedPreview: false,
      isEmbed: false,
      isPrintMode: false,
      viewMode: VIEW_MODE.FULL
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
});
