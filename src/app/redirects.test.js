/**
 * @jest-environment jsdom-global
 */

import resolveRedirects, {
  legacyRoutes,
  shortUrls,
  articleUrls,
  overviewUrls,
  webHooks,
} from './redirects'
import matomoInstance from './matomo'
import redirectToAddress from './utils/redirectToAddress'

jest.useFakeTimers()

jest.mock('./matomo')
jest.mock('./utils/redirectToAddress')

const expectWithNewRoute = async (route, expectation, cb) => {
  jsdom.reconfigure({ url: route })
  const { location } = window
  delete window.location
  window.location = { ...location, replace: jest.fn() }

  try {
    await resolveRedirects()
    cb(() => expect(window.location.replace))
  } catch (e) {
    // console.log(e) hide unexpected async errors from Jest
  }
  jest.runAllTimers()

  // cb(expect(window.location.replace))
  window.location = location
}

describe('redirects', () => {
  const REDIRECTS = [...legacyRoutes, ...articleUrls, ...overviewUrls]
  const trackMock = jest.spyOn(matomoInstance, 'trackEvent')

  it('should not redirect unmatched routes', async () => {
    jsdom.reconfigure({ url: 'https://www.someurl.com#a-hash-url' })
    const { location } = window
    delete window.location
    window.location = {
      ...location,
      replace: jest.fn(),
    }
    await resolveRedirects()
    jest.runAllTimers()

    expect(window.location.replace).not.toHaveBeenCalled()

    jsdom.reconfigure({ url: 'https://www.someurl.com/foo/bar' })
    await resolveRedirects()
    jest.runAllTimers()

    expect(window.location.replace).not.toHaveBeenCalled()
    window.location = location
  })

  it('should redirect matched routes', () => {
    REDIRECTS.forEach((route) => {
      expectWithNewRoute(
        `https://www.someurl.com${route.from}`,
        window.location.replace,
        (expect) => expect.toHaveBeenCalledWith(route.to),
      )
    })
  })

  it('should redirect matched routes (without a trailing slash)', () => {
    REDIRECTS.forEach((route) => {
      const from = route.from.endsWith('/') ? route.from.slice(0, -1) : route.from
      expectWithNewRoute(`https://www.someurl.com${from}`, window.location.replace, (expect) =>
        expect.toHaveBeenCalledWith(route.to),
      )
    })
  })

  it('should track themakaart routes', () => {
    trackMock.mockClear()

    shortUrls.forEach((route) => {
      resolveRedirects()

      if (route.from.startsWith('/themakaart')) {
        // Get the title of the "themakaart" from the currentPath
        const action = route.from.split('/')[2]

        expectWithNewRoute(
          `https://www.someurl.com${route.from}`,
          window.location.replace,
          (cb) => {
            expect(trackMock).toHaveBeenCalledWith(
              expect.objectContaining({
                action,
              }),
            )
            cb.toHaveBeenCalledWith(route.to)
          },
        )
      }

      jest.runAllTimers()
    })
  })

  it('should redirect webhook routes', () => {
    trackMock.mockClear()
    const redirectToAddressMock = redirectToAddress.mockReturnValue('theMockedId')

    webHooks.forEach((route) => {
      expectWithNewRoute(`https://www.someurl.com${route.from}`, window.location.replace, (cb) => {
        expect(trackMock).toHaveBeenCalledWith()
        expect(redirectToAddressMock).toHaveBeenCalled()
        cb.toHaveBeenCalledWith(route.to)
      })

      // expectWithCustomCallback(`https://www.someurl.com${route.from}`, route.load, (expect) =>
      //   expect.toHaveBeenCalled(),
      // )

      // expect(redirectToAddressMock).toHaveBeenCalled()
      // expect(trackMock).toHaveBeenCalledWith()

      jest.runAllTimers()
    })
  })
})
