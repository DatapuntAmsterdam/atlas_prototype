import contextMiddleware from './context-middleware';
import ACTIONS from '../../actions';

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
      type: ACTIONS.FETCH_SEARCH_RESULTS_BY_LOCATION,
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
});
