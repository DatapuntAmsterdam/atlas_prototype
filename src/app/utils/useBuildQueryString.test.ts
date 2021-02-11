import { renderHook } from '@testing-library/react-hooks'
import useBuildQueryString from './useBuildQueryString'
import {
  locationParam,
  mapLayersParam,
  panoHeadingParam,
  panoPitchParam,
  zoomParam,
} from '../pages/MapPage/query-params'

jest.mock('react-router-dom', () => ({
  // @ts-ignore
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: 'some-url/',
    search: 'pitch=3&tags=panobi&randomParam="should-stay"&lagen=pano-pano2020bi_pano-pano2019bi',
  }),
}))

describe('useBuildQueryString', () => {
  it('should build a string of URL query parameters', () => {
    const { result } = renderHook(() => useBuildQueryString())
    const queryString = result.current.buildQueryString<any>([
      [panoPitchParam, 0],
      [panoHeadingParam, -123],
      [locationParam, { lat: 4.23124, lng: 2.44566 }],
      [zoomParam, 11],
    ])

    expect(queryString).toBe(
      'heading=-123&lagen=pano-pano2020bi_pano-pano2019bi&locatie=4.23124%2C2.44566&pitch=0&randomParam=%22should-stay%22&tags=panobi&zoom=11',
    )
  })

  it('should omit certain query parameters from the current location', () => {
    const { result } = renderHook(() => useBuildQueryString())
    const queryString = result.current.buildQueryString<any>(undefined, [zoomParam, panoPitchParam])

    expect(queryString).toBe(
      'lagen=pano-pano2020bi_pano-pano2019bi&randomParam=%22should-stay%22&tags=panobi',
    )
  })

  it('should remove the parameter from the URL if the default value of that parameter is set', () => {
    const { result } = renderHook(() => useBuildQueryString())
    const queryString = result.current.buildQueryString<any>([
      [panoPitchParam, panoPitchParam.defaultValue],
      [locationParam, locationParam.defaultValue],
    ])

    expect(queryString).toBe(
      'lagen=pano-pano2020bi_pano-pano2019bi&randomParam=%22should-stay%22&tags=panobi',
    )
  })

  it('should remove the parameter from the URL if the value of that parameter is set to null', () => {
    const { result } = renderHook(() => useBuildQueryString())
    // mapLayersParam's default value is []
    const queryString = result.current.buildQueryString<any>([[mapLayersParam, null]])

    expect(queryString).toBe('pitch=3&randomParam=%22should-stay%22&tags=panobi')
  })
})
