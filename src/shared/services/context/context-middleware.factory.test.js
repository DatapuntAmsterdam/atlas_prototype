import contextMiddleware from './context-middleware';
import ACTIONS, { FETCH_SEARCH_RESULTS_BY_LOCATION } from '../../actions';

describe('The contextMiddleware factory', () => {
  const mockedStore = {
    getState: () => 'FAKE_STATE'
  };

  const mockedNext = (action) => action;

  const mockedAction = {};

  beforeEach(() => {
    mockedAction.type = 'FAKE_ACTION';
    mockedAction.payload = {};
  });

  it('calls the next action', () => {
    const returnValue = contextMiddleware(mockedStore)(mockedNext)(mockedAction);

    expect(returnValue).toEqual({
      type: 'FAKE_ACTION',
      payload: {}
    });
  });

  it('translates MAP_CLICK actions, default in search results', () => {
    mockedAction.type = ACTIONS.MAP_CLICK;

    const returnValue = contextMiddleware(mockedStore)(mockedNext)(mockedAction);

    expect(returnValue).toEqual({
      type: FETCH_SEARCH_RESULTS_BY_LOCATION,
      payload: {}
    });
  });

  it('translates MAP_CLICK actions to straatbeeld updates when a straatbeeld is active', () => {
    mockedAction.type = ACTIONS.MAP_CLICK;
    mockedStore.getState = () => ({
      straatbeeld: {
        id: 'abc'
      }
    });

    const returnValue = contextMiddleware(mockedStore)(mockedNext)(mockedAction);

    expect(returnValue).toEqual({
      type: ACTIONS.FETCH_STRAATBEELD_BY_LOCATION,
      payload: {}
    });
  });

  it('translates HIDE_STRAATBEELD action in SHOW_PAGE if there is a page active (but invisible)', () => {
    mockedAction.type = ACTIONS.HIDE_STRAATBEELD;
    mockedStore.getState = () => ({
      page: {
        name: 'home'
      },
      straatbeeld: {
        location: [1, 2]
      }
    });

    const returnValue = contextMiddleware(mockedStore)(mockedNext)(mockedAction);

    expect(returnValue).toEqual({
      type: ACTIONS.SHOW_PAGE,
      payload: {
        name: 'home'
      }
    });
  });

  it('translates HIDE_STRAATBEELD action in search results', () => {
    mockedAction.type = ACTIONS.HIDE_STRAATBEELD;
    mockedStore.getState = () => ({
      straatbeeld: {
        location: [1, 2]
      }
    });

    const returnValue = contextMiddleware(mockedStore)(mockedNext)(mockedAction);

    expect(returnValue).toEqual({
      type: FETCH_SEARCH_RESULTS_BY_LOCATION,
      payload: [1, 2]
    });
  });

  it('translates HIDE_STRAATBEELD action in fetch detail when details available', () => {
    mockedAction.type = ACTIONS.HIDE_STRAATBEELD;
    mockedStore.getState = () => ({
      detail: {
        endpoint: 'aap'
      }
    });

    const returnValue = contextMiddleware(mockedStore)(mockedNext)(mockedAction);

    expect(returnValue).toEqual({
      type: ACTIONS.FETCH_DETAIL,
      payload: 'aap'
    });
  });
});
