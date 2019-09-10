/**
 * @jest-environment jsdom-global
 */

import resolveRedirects, { routesDictionary } from './redirects'

jest.useFakeTimers()

describe('redirects', () => {
  const { replace } = window.location

  beforeEach(() => {
    Object.defineProperty(window.location, 'replace', {
      configurable: true,
    })
    window.location.replace = jest.fn()
  })

  afterEach(() => {
    window.location.replace = replace
  })

  it('should call window.location.replace if route needs to be redirected', () => {
    routesDictionary.forEach(route => {
      jsdom.reconfigure({ url: `https://www.someurl.com${route.from}` })
      resolveRedirects()

      jest.runAllTimers() // mocks the timeout that try to prevent cancelling the Matomo requests

      expect(window.location.replace).toHaveBeenCalledWith(route.to)
    })
  })

  it('should not call window.location.replace if route does not match the config', () => {
    jsdom.reconfigure({ url: 'https://www.someurl.com#a-hash-url' })
    resolveRedirects()
    expect(window.location.replace).not.toHaveBeenCalled()

    jsdom.reconfigure({ url: 'https://www.someurl.com/foo/bar' })
    resolveRedirects()

    jest.runAllTimers() // mocks the timeout that try to prevent cancelling the Matomo requests

    expect(window.location.replace).not.toHaveBeenCalled()
  })
})
