import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import LegacyLink from 'redux-first-router-link'
import { LatLngLiteral } from 'leaflet'
import { getDetailLocation } from '../../store/redux-first-router/selectors'
import usePromise, { PromiseStatus } from './usePromise'
import { getPanoramaThumbnail } from '../../api/panorama/thumbnail'
import buildQueryString from './buildQueryString'
import { locationParam, panoParam } from '../pages/MapPage/query-params'
import { PANORAMA_CONFIG } from '../../panorama/services/panorama-api/panorama-api'
import { toPanoramaAndPreserveQuery } from '../../store/redux-first-router/actions'

const useGetLegacyPanoramaPreview = (
  location: (LatLngLiteral & { latitude: number; longitude: number }) | null,
) => {
  const legacyReference = useSelector(getDetailLocation)
  const panoramaResult = usePromise(
    useMemo(
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
    ),
  )

  if (panoramaResult.status !== PromiseStatus.Fulfilled) {
    return {
      linkComponent: 'div',
      link: null,
      panoramaUrl: '',
    }
  }

  // @ts-ignore
  const panoramaUrl = panoramaResult?.value?.url

  const panoramaLink = buildQueryString<any>([
    [
      panoParam,
      { heading: panoramaResult?.value?.heading, pitch: 0, fov: PANORAMA_CONFIG.DEFAULT_FOV },
    ],
    [locationParam, location],
  ])
  const link =
    window.location.pathname === '/kaart' || window.location.pathname === '/kaart/'
      ? `${window.location.pathname}?${panoramaLink}`
      : toPanoramaAndPreserveQuery(
          panoramaResult?.value?.id,
          panoramaResult?.value?.heading,
          legacyReference,
        )

  const linkComponent =
    window.location.pathname === '/kaart' || window.location.pathname === '/kaart/'
      ? RouterLink
      : LegacyLink

  return {
    linkComponent,
    link,
    panoramaUrl,
  }
}

export default useGetLegacyPanoramaPreview
