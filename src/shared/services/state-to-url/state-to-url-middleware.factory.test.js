import ACTIONS from '../../actions';
import stateToUrlMiddleware from './state-to-url-middleware';

describe('The stateToUrlMiddleware factory', () => {
  const mockedStore = {
    getState: () => 'FAKE_STATE'
  };
  const mockedNext = (action) => action;
  const mockedAction = {
    type: 'FAKE_ACTION',
    payload: {}
  };

  beforeEach(() => {
    global.stateToUrl = {
      update: jest.fn()
    };
    jest.spyOn(global.stateToUrl, 'update');
  });

  it('calls the next action', () => {
    const returnValue = stateToUrlMiddleware(mockedStore)(mockedNext)(mockedAction);

    expect(returnValue).toEqual({
      type: 'FAKE_ACTION',
      payload: {}
    });
  });

  it('and call the stateToUrl service', () => {
    stateToUrlMiddleware(mockedStore)(mockedNext)(mockedAction);

    expect(global.stateToUrl.update).toHaveBeenCalledWith('FAKE_STATE', jasmine.anything());
  });

  it('doesn\'t call stateToUrl.update for these actions', () => {
    const actionWithoutUrlUpdate = [
      ACTIONS.URL_CHANGE,
      ACTIONS.FETCH_DETAIL,
      ACTIONS.FETCH_STRAATBEELD_BY_HOTSPOT,
      ACTIONS.SHOW_STRAATBEELD_INITIAL,
      ACTIONS.MAP_CLICK,
      ACTIONS.FETCH_SEARCH_RESULTS_BY_LOCATION,
      ACTIONS.FETCH_SEARCH_RESULTS_CATEGORY,
      ACTIONS.MAP_ADD_PANO_OVERLAY,
      ACTIONS.MAP_REMOVE_PANO_OVERLAY,
      ACTIONS.MAP_CLICK,
      ACTIONS.MAP_START_DRAWING,
      ACTIONS.FETCH_DETAIL,
      ACTIONS.FETCH_STRAATBEELD_BY_HOTSPOT,
      ACTIONS.SHOW_STRAATBEELD_INITIAL,
      ACTIONS.FETCH_DATA_SELECTION,
      ACTIONS.RESET_DATA_SELECTION,
      ACTIONS.APPLY_FILTERS,
      ACTIONS.EMPTY_FILTERS
    ];

    actionWithoutUrlUpdate.forEach((action) => {
      stateToUrlMiddleware(mockedStore)(mockedNext)({
        type: action,
        payload: {}
      });

      expect(global.stateToUrl.update).not.toHaveBeenCalledWith(['FAKE_STATE', jasmine.anything()]);
    });
  });

  it('does call stateToUrl.update for all other actions', () => {
    const actionsWithUrlUpdate = [
      ACTIONS.SHOW_SEARCH_RESULTS,
      ACTIONS.MAP_PAN,
      ACTIONS.MAP_ZOOM,
      ACTIONS.MAP_END_DRAWING,
      ACTIONS.SHOW_DETAIL,
      ACTIONS.DETAIL_FULLSCREEN,
      ACTIONS.FETCH_STRAATBEELD_BY_ID,
      ACTIONS.FETCH_STRAATBEELD_BY_LOCATION,
      ACTIONS.SHOW_STRAATBEELD_SUBSEQUENT,
      ACTIONS.SET_STRAATBEELD_ORIENTATION,
      ACTIONS.SET_STRAATBEELD_HISTORY,
      ACTIONS.SHOW_DATA_SELECTION,
      ACTIONS.NAVIGATE_DATA_SELECTION,
      ACTIONS.SET_DATA_SELECTION_VIEW,
      ACTIONS.SHOW_HOME,
      ACTIONS.SHOW_PAGE
    ];

    actionsWithUrlUpdate.forEach((action) => {
      stateToUrlMiddleware(mockedStore)(mockedNext)({
        type: action,
        payload: {}
      });

      expect(global.stateToUrl.update).toHaveBeenCalledWith('FAKE_STATE', jasmine.anything());
    });
  });

  it('replaces the URL for some actions', () => {
    const shouldUseReplace = [
      ACTIONS.MAP_PAN,
      ACTIONS.MAP_ZOOM,
      ACTIONS.DETAIL_FULLSCREEN,
      ACTIONS.SHOW_STRAATBEELD_SUBSEQUENT,
      ACTIONS.SET_STRAATBEELD_ORIENTATION
    ];
    const shouldNotUseReplace = [
      ACTIONS.SHOW_SEARCH_RESULTS,
      ACTIONS.MAP_END_DRAWING,
      ACTIONS.SHOW_DETAIL,
      ACTIONS.FETCH_STRAATBEELD_BY_ID,
      ACTIONS.FETCH_STRAATBEELD_BY_LOCATION,
      ACTIONS.SET_STRAATBEELD_HISTORY,
      ACTIONS.SHOW_DATA_SELECTION,
      ACTIONS.NAVIGATE_DATA_SELECTION,
      ACTIONS.SET_DATA_SELECTION_VIEW,
      ACTIONS.SHOW_HOME,
      ACTIONS.SHOW_PAGE
    ];

    shouldUseReplace.forEach((action) => {
      stateToUrlMiddleware(mockedStore)(mockedNext)({
        type: action,
        payload: {}
      });

      expect(global.stateToUrl.update).toHaveBeenCalledWith('FAKE_STATE', true);
    });

    shouldNotUseReplace.forEach((action) => {
      stateToUrlMiddleware(mockedStore)(mockedNext)({
        type: action,
        payload: {}
      });

      expect(global.stateToUrl.update).toHaveBeenCalledWith('FAKE_STATE', false);
    });
  });

  it('vanilla reducers should trigger new url', () => {
    stateToUrlMiddleware(mockedStore)(mockedNext)({
      type: 'STRING_TYPE',
      payload: {}
    });

    expect(global.stateToUrl.update).toHaveBeenCalledWith('FAKE_STATE', false);
  });

  it('AUTHENTICATE_USER should not trigger new url', () => {
    stateToUrlMiddleware(mockedStore)(mockedNext)({
      type: 'AUTHENTICATE_USER',
      payload: {}
    });

    expect(global.stateToUrl.update).not.toHaveBeenCalledWith(['FAKE_STATE', false]);
  });
});
