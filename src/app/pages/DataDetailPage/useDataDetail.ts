import { useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDetailData, getServiceDefinition } from '../../../map/services/map'
import { clearMapDetail, showDetail } from '../../../shared/ducks/detail/actions'
import { fetchMapDetailSuccess } from '../../../map/ducks/detail/actions'
import getGeometry from '../../../shared/services/geometry/geometry'
import { setViewMode, VIEW_MODE } from '../../../shared/ducks/ui/ui'
import { getCurrentEndpoint } from '../../../map/ducks/detail/selectors'
import { AuthError } from '../../../shared/services/api/errors'
import mapFetch from '../../../map/services/map-fetch/map-fetch'
import useAuthScope from '../../utils/useAuthScope'

// Todo: AfterBeta: can be removed
const useDataDetail = (id: string, subType: string, type: string) => {
  const dispatch = useDispatch()
  const [retryCount, setRetryCount] = useState(0)

  const currentEndpoint = useSelector(getCurrentEndpoint)

  const onRetry = useCallback(() => {
    setRetryCount((currentCount) => currentCount + 1)
  }, [setRetryCount])

  const { isUserAuthorized } = useAuthScope()

  const result = useMemo(async () => {
    try {
      const serviceDefinition = getServiceDefinition(`${type}/${subType}`)
      const userIsAuthorized = isUserAuthorized(serviceDefinition?.authScopes)

      if (!serviceDefinition) {
        const error = new AuthError(401, 'Not authorized')
        return Promise.reject(error)
      }

      if (!userIsAuthorized && serviceDefinition.authScopeRequired) {
        const error = new AuthError(401, serviceDefinition.authExcludedInfo || '')
        return Promise.reject(error)
      }

      const data = await fetchDetailData(serviceDefinition, id)

      dispatch(clearMapDetail())

      const mapDetail: any = await mapFetch(
        data,
        {
          id,
          type,
          subType,
        },
        serviceDefinition,
      )

      dispatch(fetchMapDetailSuccess(currentEndpoint, mapDetail || {}))
      const geometry = getGeometry(mapDetail)

      dispatch(
        showDetail({
          display: mapDetail._display,
          geometry,
        }),
      )
      // When a detail doesn't have a geometry, it can only be displayed in VIEWMODE.FULL
      // Some endpoints only return a geometry when the user is authenticated e.g. authorized to view it
      if (!geometry) {
        dispatch(setViewMode(VIEW_MODE.FULL))
      } else {
        dispatch(setViewMode(VIEW_MODE.SPLIT))
      }
      return {
        ...mapDetail,
        showAuthAlert: !userIsAuthorized,
        authExcludedInfo: serviceDefinition.authExcludedInfo,
      }
    } catch (e) {
      return Promise.reject(e)
    }
  }, [type, subType, id, retryCount])

  return {
    result,
    onRetry,
  }
}

export default useDataDetail
