import piwikMiddleware from './piwikMiddleware';
import piwikTracker from '../../../shared/services/piwik-tracker/piwik-tracker';

jest.mock('../../../shared/services/piwik-tracker/piwik-tracker');
jest.mock('./trackEvents', () => ({
  YOUR_ACTION_TYPE: ({ tracking }) => [
    'foo',
    'foo',
    tracking,
    null
  ]
}));

describe('piwikMiddleware', () => {
  const next = jest.fn();
  const store = jest.fn();
  store.getState = jest.fn(() => ({ user: { authenticated: false, scopes: [] }, ui: {} }));

  beforeEach(() => {
    global.window._paq = {
      push: jest.fn()
    };
  });

  afterEach(() => {
    piwikTracker.mockReset();
  });

  it('should send a request to piwik if action should be tracked', () => {
    const action = { type: 'YOUR_ACTION_TYPE', meta: { tracking: 'data' } };

    piwikMiddleware(store)(next)(action);

    expect(piwikTracker).toHaveBeenCalled();
  });

  it('should send a request to piwik if action should be tracked and has tracking metadata', () => {
    const action = { type: 'YOUR_ACTION_TYPE' };

    piwikMiddleware(store)(next)(action);

    expect(piwikTracker).not.toHaveBeenCalled();
  });

  it('should NOT send a request to piwik if action should NOT be tracked', () => {
    const action = { type: 'YOUR_ACTION_TYPE_2', meta: { tracking: 'data' } };

    piwikMiddleware(store)(next)(action);

    expect(piwikTracker).not.toHaveBeenCalled();
  });
});
