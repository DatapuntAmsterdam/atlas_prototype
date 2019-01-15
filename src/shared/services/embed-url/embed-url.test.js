import { getIframeUrl, getEmbedButtonLink } from './embed-url';

describe('getIframeUrl', () => {
  it('should return the current url and add embed=true', () => {
    jsdom.reconfigure({ url: 'https://www.someurl.com/?foo=bar' });
    expect(getIframeUrl()).toEqual('https://www.someurl.com/?foo=bar&embed=true');

    jsdom.reconfigure({ url: 'https://www.someurl.com/' });
    expect(getIframeUrl()).toEqual('https://www.someurl.com/?embed=true');
  });

  it('should return the current url and remove embed-preview=true', () => {
    jsdom.reconfigure({ url: 'https://www.someurl.com/?foo=bar&embed-preview=true' });
    expect(getIframeUrl()).toEqual('https://www.someurl.com/?foo=bar&embed=true');

    jsdom.reconfigure({ url: 'https://www.someurl.com/?embed-preview=true' });
    expect(getIframeUrl()).toEqual('https://www.someurl.com/?embed=true');
  });
});

describe('getEmbedButtonLink', () => {
  it('should return the current url and remove embed=true', () => {
    jsdom.reconfigure({ url: 'https://www.someurl.com/?foo=bar&embed=true' });
    expect(getEmbedButtonLink()).toEqual('https://www.someurl.com/?foo=bar');

    jsdom.reconfigure({ url: 'https://www.someurl.com/?embed=true' });
    expect(getEmbedButtonLink()).toEqual('https://www.someurl.com/');

    jsdom.reconfigure({ url: 'https://www.someurl.com/' });
    expect(getEmbedButtonLink()).toEqual('https://www.someurl.com/');
  });
});
