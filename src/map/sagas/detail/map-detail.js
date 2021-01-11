import { put, select } from 'redux-saga/effects'
import { getDetailEndpoint } from '../../../shared/ducks/detail/selectors'
import { ViewMode } from '../../../shared/ducks/ui/ui'
import PARAMETER from '../../../store/parameters'
import { getMapDetail } from '../../ducks/detail/actions'
import { closeMapPanel } from '../../ducks/map/actions'

// eslint-disable-next-line import/prefer-default-export
export function* fetchDetailEffect(action) {
  const oldView = action?.meta?.location?.prev?.query?.[PARAMETER.VIEW] ?? null
  const newView = action?.meta?.location?.current?.query?.[PARAMETER.VIEW] ?? null

  if (oldView !== newView && newView === ViewMode.Split) {
    yield put(closeMapPanel())
  }

  const endpoint = yield select(getDetailEndpoint)
  yield put(getMapDetail(endpoint))
}
