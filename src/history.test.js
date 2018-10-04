import historyInstance, { history } from './history';
import ACTIONS from './shared/actions';

describe('the history object', () => {
  let store;

  beforeEach(() => {
    store = {
      dispatch: jest.fn()
    };
  });

  beforeEach(() => {
    historyInstance.initialize(store);
  });

  it('should listen handle location hashed search params', () => {
    const location = {
      hash: '#?foo=bar%2Fwith%2Fslashes&abc=xyz:with:colons'
    };

    history.push(location.hash);

    expect(store.dispatch).toHaveBeenCalledWith({
      type: ACTIONS.URL_CHANGE,
      payload: {
        foo: 'bar/with/slashes',
        abc: 'xyz:with:colons'
      }
    });
  });

  it('should not parse misformed hash', () => {
    const location = {
      hash: '?foo=bar&abc=xyz' // Note: no hash prefix
    };

    history.push(location.hash);

    expect(store.dispatch).toHaveBeenCalledWith({
      type: ACTIONS.URL_CHANGE,
      payload: {}
    });
  });
});
