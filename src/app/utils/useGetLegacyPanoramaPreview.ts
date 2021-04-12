import { LatLngLiteral } from 'leaflet'
import { useSelector } from 'react-redux'
import { AnyAction } from 'redux'
import { useLocation } from 'react-router-dom'
import usePromise, { isFulfilled, isPending, isRejected } from '@amsterdam/use-promise'
import { getPanoramaThumbnail } from '../../api/panorama/thumbnail'
import { toPanoramaAndPreserveQuery } from '../../store/redux-first-router/actions'
import { getDetailLocation } from '../../store/redux-first-router/selectors'
import { locationParam, panoHeadingParam, panoPitchParam } from '../pages/MapPage/query-params'
import pickLinkComponent from './pickLinkComponent'
import useBuildQueryString from './useBuildQueryString'

const useGetLegacyPanoramaPreview = (
  location: (LatLngLiteral & { latitude: number; longitude: number }) | null,
): {
  linkComponent: any
  link: AnyAction | string | null
  loading: boolean
  error: any | null
  panoramaUrl?: string
} => {
  const legacyReference = useSelector(getDetailLocation)
  const browserLocation = useLocation()
  const panoramaResult = usePromise(
    () =>
      location
        ? getPanoramaThumbnail(
            {
              lat: location.lat || location.latitude,
              lng: location.lng || location.longitude,
            },
            {
              width: 400,
              fov: 90,
              horizon: 0.4,
              aspect: 1.4,
              radius: 180,
            },
          )
        : Promise.reject(),
    [location],
  )
  const { buildQueryString } = useBuildQueryString()

  if (!isFulfilled(panoramaResult)) {
    return {
      linkComponent: 'div',
      link: null,
      panoramaUrl: '',
      error: isRejected(panoramaResult) ? panoramaResult.reason : null,
      loading: isPending(panoramaResult),
    }
  }

  const panoramaUrl = panoramaResult.value?.url
  const panoramaLink = buildQueryString<any>([
    [panoPitchParam, 0],
    [panoHeadingParam, panoramaResult.value?.heading],
    [locationParam, location],
  ])
  const link =
    browserLocation.pathname === '/kaart' || browserLocation.pathname === '/kaart/'
      ? `${browserLocation.pathname}?${panoramaLink}`
      : toPanoramaAndPreserveQuery(
          // eslint-disable-next-line camelcase
          panoramaResult.value?.pano_id,
          panoramaResult.value?.heading,
          legacyReference,
        )

  return {
    linkComponent: pickLinkComponent(link),
    link,
    panoramaUrl,
    error: null,
    loading: false,
  }
}

export default useGetLegacyPanoramaPreview
