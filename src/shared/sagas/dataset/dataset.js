import { call, put, race, select, take, takeLatest } from 'redux-saga/effects'
import formatDetailData from '../../../detail/services/data-formatter/data-formatter'
import { getParts, getTemplateUrl } from '../../../detail/services/endpoint-parser/endpoint-parser'
import { toNotFoundPage } from '../../../store/redux-first-router/actions'
import {
  fetchApiSpecificationFailure,
  fetchApiSpecificationRequest,
  fetchApiSpecificationSuccess,
  FETCH_API_SPECIFICATION_FAILURE,
  FETCH_API_SPECIFICATION_REQUEST,
  FETCH_API_SPECIFICATION_SUCCESS,
} from '../../ducks/datasets/apiSpecification/apiSpecification'
import { getApiSpecificationData } from '../../ducks/datasets/datasets'
import { fetchDetailRequest, fetchDetailSuccess } from '../../ducks/detail/actions'
import { getUserScopes } from '../../ducks/user/user'
import { fetchWithToken } from '../../services/api/api'
import getApiSpecification from '../../services/datasets-filters/datasets-filters'
import { waitForAuthentication } from '../user/user'

/* istanbul ignore next */
export function* ensureCatalogFilters() {
  const state = yield select()
  const catalogFilters = getApiSpecificationData(state)
  if (Object.keys(catalogFilters || {}).length > 0) return

  yield put(fetchApiSpecificationRequest())
  yield race([take(FETCH_API_SPECIFICATION_SUCCESS), take(FETCH_API_SPECIFICATION_FAILURE)])
}

/* istanbul ignore next */
export function* getDatasetData(endpoint) {
  const includeSrc = getTemplateUrl(endpoint)
  const [category, subject] = getParts(endpoint)

  const scopes = yield select(getUserScopes)

  yield call(ensureCatalogFilters)
  const catalogFilters = yield select(getApiSpecificationData)

  try {
    const data = yield fetchWithToken(`${endpoint}`)

    const formatedData = {
      ...formatDetailData(data, category, subject, catalogFilters, scopes),
    }

    return {
      includeSrc,
      data: formatedData,
    }
  } catch (e) {
    return false
  }
}

/**
 * For some reason we need the whole list of datasets to be able to show the dataset detail page
 * (angularjs legacy detail.component).
 * That's why we need to check if we need to fetch datasets if it didn't. This way we prevent
 * fetching on every dataset page.
 * @returns {IterableIterator<*>}
 */
/* istanbul ignore next */
export function* fetchDatasetEffect(action) {
  yield call(waitForAuthentication)
  yield put(fetchDetailRequest(true)) // Set the loading state
  const endpoint = `${process.env.API_ROOT}dcatd/datasets/${action.payload.id}`

  const detailData = yield call(getDatasetData, endpoint)

  if (!detailData) {
    yield put(toNotFoundPage())
  }
  yield put(fetchDetailSuccess(detailData))
}

export function* retrieveApiSpecification() {
  try {
    const data = yield call(getApiSpecification)
    yield put(fetchApiSpecificationSuccess(data))
  } catch (e) {
    yield put(fetchApiSpecificationFailure(e))
  }
}

export default function* watchFetchDatasets() {
  yield takeLatest(FETCH_API_SPECIFICATION_REQUEST, retrieveApiSpecification)
}
