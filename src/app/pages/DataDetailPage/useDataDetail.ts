import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { fetchMapDetailSuccess } from '../../../map/ducks/detail/actions'
import { getCurrentEndpoint } from '../../../map/ducks/detail/selectors'
import { fetchDetailData, getServiceDefinition } from '../../../map/services/map'
import mapFetch from '../../../map/services/map-fetch/map-fetch'
import { clearMapDetail, showDetail } from '../../../shared/ducks/detail/actions'
import { getViewMode, setViewMode, VIEW_MODE } from '../../../shared/ducks/ui/ui'
import { AuthError, NotFoundError } from '../../../shared/services/api/errors'
import getGeometry from '../../../shared/services/geometry/geometry'
import { routing } from '../../routes'
import useAuthScope from '../../utils/useAuthScope'

// Todo: AfterBeta: can be removed
export default function useDataDetail() {
  const dispatch = useDispatch()
  const history = useHistory()

  const view = useSelector(getViewMode)
  const currentEndpoint = useSelector(getCurrentEndpoint)

  const { isUserAuthorized } = useAuthScope()

  return async function getDetailData<T = any>(
    id: string,
    subType: string,
    type: string,
  ): Promise<T> {
    try {
      const serviceDefinition = getServiceDefinition(`${type}/${subType}`)
      const userIsAuthorized = isUserAuthorized(serviceDefinition?.authScopes)

      if (!serviceDefinition) {
        history.push(routing.niet_gevonden.path)
        return Promise.reject()
      }

      if (!userIsAuthorized && serviceDefinition.authScopeRequired) {
        const error = new AuthError(401, serviceDefinition.authExcludedInfo || '')
        return Promise.reject(error)
      }

      let data
      try {
        data = await fetchDetailData(serviceDefinition, id)
      } catch (e) {
        if (e instanceof NotFoundError) {
          history.push(routing.niet_gevonden.path)
          return Promise.reject()
        }
      }

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
      } else if (view !== VIEW_MODE.MAP) {
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
  }
}
