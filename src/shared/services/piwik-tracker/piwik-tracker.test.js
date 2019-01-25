import piwikTracker from './piwik-tracker';

describe('piwikTracker', () => {
  beforeEach(() => {
    global.window._paq = {
      push: jest.fn()
    };
  });

  it('should call window._paq.push', () => {
    piwikTracker(['test']);

    expect(global.window._paq.push).toHaveBeenCalledWith(['test']);
  });

  it('should not call window._paq.push without data', () => {
    piwikTracker([]);

    expect(global.window._paq.push).not.toHaveBeenCalled();
  });
});
