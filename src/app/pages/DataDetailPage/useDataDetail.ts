import { useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDetailData, getServiceDefinition } from '../../../map/services/map'
import { clearMapDetail, showDetail } from '../../../shared/ducks/detail/actions'
import fetchDetail from '../../../map/services/map-detail/map-detail'
import { fetchMapDetailSuccess } from '../../../map/ducks/detail/actions'
import getGeometry from '../../../shared/services/geometry/geometry'
import { setViewMode, VIEW_MODE } from '../../../shared/ducks/ui/ui'
import { getUser, getUserScopes } from '../../../shared/ducks/user/user'
import { getCurrentEndpoint } from '../../../map/ducks/detail/selectors'
import { AuthError } from '../../../shared/services/api/errors'

const useDataDetail = (id: string, subType: string, type: string) => {
  const dispatch = useDispatch()
  const [retryCount, setRetryCount] = useState(0)

  const user = useSelector(getUser)
  const currentEndpoint = useSelector(getCurrentEndpoint)
  const scopes = useSelector(getUserScopes)

  const onRetry = useCallback(() => {
    setRetryCount((currentCount) => currentCount + 1)
  }, [setRetryCount])

  const result = useMemo(async () => {
    try {
      const serviceDefinition = getServiceDefinition(`${type}/${subType}`)

      if (!serviceDefinition) {
        const error = new AuthError(401, 'Not authorized')
        return Promise.reject(error)
      }

      if (serviceDefinition.authScope && !scopes.includes(serviceDefinition.authScope)) {
        const error = new AuthError(
          401,
          `Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om ${
            serviceDefinition.definition?.singular || 'deze data'
          } te bekijken.`,
        )
        return Promise.reject(error)
      }

      const data = await fetchDetailData(serviceDefinition, id)
      // Todo: dispatch user auth
      // const didAuthCheck = useSelector(userCheckedAuthentication)

      dispatch(clearMapDetail())

      const mapDetail: any = await fetchDetail(data.data, serviceDefinition, user, {
        type,
        subType,
        id,
      })

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
      if (mapDetail.isAuthorized && !geometry) {
        dispatch(setViewMode(VIEW_MODE.FULL))
      }

      return mapDetail
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
