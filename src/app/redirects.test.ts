import resolveRedirects, {
  articleUrls,
  legacyRoutes,
  overviewUrls,
  shortUrls,
  webHooks,
} from './redirects'
import matomoInstance from './matomo'
import getVerblijfsobjectIdFromAddressQuery from './utils/getVerblijfsobjectIdFromAddressQuery'
import * as panoramaApi from './pages/MapPage/components/PanoramaViewer/panorama-api/panorama-api'
import { MAIN_PATHS } from './routes'

jest.useFakeTimers()

jest.mock('./matomo')
jest.mock('./utils/getVerblijfsobjectIdFromAddressQuery')

describe('redirects', () => {
  const expectWithNewRoute = async (
    route: string,
    expectation: (url: string) => void,
    cb: (fn: jest.JestMatchers<(url: string) => void>) => void,
  ) => {
    try {
      const url = new URL(route)
      // @ts-ignore
      await resolveRedirects({
        ...url,
        replace: jest.fn() as (url: string) => void,
      })
      cb(expect(window.location.replace))
    } catch {
      // no-op
    }

    jest.runAllTimers()
  }

  const REDIRECTS = [...legacyRoutes, ...articleUrls, ...overviewUrls]
  const trackMock = jest.spyOn(matomoInstance, 'trackEvent')

  it('should not redirect unmatched routes', async () => {
    const urlOne = new URL('https://www.someurl.com#a-hash-url')
    const replaceMock = jest.fn()
    // @ts-ignore
    await resolveRedirects({
      ...urlOne,
      replace: replaceMock,
    })
    jest.runAllTimers()

    expect(replaceMock).not.toHaveBeenCalled()

    // @ts-ignore
    const urlTwo = new URL('https://www.someurl.com/foo/bar')
    // @ts-ignore
    await resolveRedirects({
      ...urlTwo,
      replace: replaceMock,
    })
    jest.runAllTimers()

    expect(replaceMock).not.toHaveBeenCalled()
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
      expectWithNewRoute(
        `https://www.someurl.com${from}`,
        window.location.replace,
        (expect: jest.Matchers<void>) => expect.toHaveBeenCalledWith(route.to),
      )
    })
  })

  it('should track themakaart routes', () => {
    trackMock.mockClear()

    shortUrls.forEach((route) => {
      if (route.from.startsWith('/themakaart')) {
        // Get the title of the "themakaart" from the currentPath
        const action = route.from.split('/')[2]

        expectWithNewRoute(
          `https://www.someurl.com${route.from}`,
          window.location.replace,
          (cb: jest.Matchers<void>) => {
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
    const redirectToAddressMock =
      // @ts-ignore
      getVerblijfsobjectIdFromAddressQuery.mockReturnValue('theMockedId')

    webHooks.forEach((route) => {
      expectWithNewRoute(
        `https://www.someurl.com${route.from}`,
        window.location.replace,
        (cb: jest.Matchers<void>) => {
          expect(trackMock).toHaveBeenCalledWith()
          expect(redirectToAddressMock).toHaveBeenCalled()
          cb.toHaveBeenCalledWith(route.to)
        },
      )

      jest.runAllTimers()
    })
  })

  describe('legacy panorama urls', () => {
    it('should redirect legacy panorama urls', async () => {
      jest
        .spyOn(panoramaApi, 'getImageDataById')
        // @ts-ignore
        .mockReturnValue(Promise.resolve({ location: [321, 123] }))
      const { pathname, hash, search, href } = new URL(
        `https://www.someurl.com/${MAIN_PATHS.DATA}/panorama/123?heading=30`,
      )
      const replaceMock = jest.fn()
      // @ts-ignore
      await resolveRedirects({
        pathname,
        hash,
        search,
        href,
        replace: replaceMock,
      })

      jest.runAllTimers()

      expect(replaceMock).toHaveBeenCalledWith(
        `/${MAIN_PATHS.DATA}/geozoek/?locatie=321%2C123&heading=30&fov=30&pitch=10`,
      )
    })

    it('should redirect legacy panorama urls to geozoek page without parameters when panorama location cannot be fetched', async () => {
      jest.spyOn(panoramaApi, 'getImageDataById').mockReturnValue(Promise.reject())
      const { pathname, hash, search, href } = new URL(
        `https://www.someurl.com/${MAIN_PATHS.DATA}/panorama/123`,
      )
      const replaceMock = jest.fn()
      // @ts-ignore
      await resolveRedirects({
        pathname,
        hash,
        search,
        href,
        replace: replaceMock,
      })

      jest.runAllTimers()

      expect(replaceMock).toHaveBeenCalledWith(`/${MAIN_PATHS.DATA}/geozoek/`)
    })
  })
})
