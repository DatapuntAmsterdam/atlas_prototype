import { call, put, takeLatest } from 'redux-saga/effects'
import { FETCH_PANORAMA_ERROR } from '../../../panorama/ducks/constants'
import { FETCH_GEO_SEARCH_RESULTS_FAILURE } from '../../ducks/data-search/constants'
import {
  FETCH_DATA_SELECTION_FAILURE,
  FETCH_MARKERS_FAILURE,
} from '../../ducks/data-selection/constants'
import { FETCH_DETAIL_FAILURE } from '../../ducks/detail/constants'
import { ERROR_TYPES, setGlobalError } from '../../ducks/error/error-message'

export function* setErrorsEffect() {
  yield put(setGlobalError(ERROR_TYPES.GENERAL_ERROR))
}

/**
 * Since we do fail to fetch the dataselection if user is not logged in, we don't want to show
 * the error. This is a quick workaround to solve it.
 * @param action
 */
export function* excludeUnauthorizedErrorEffect(action) {
  if (action.payload !== '401') {
    yield call(setErrorsEffect)
  }
}

export default function* watchErrors() {
  yield takeLatest(
    [
      FETCH_MARKERS_FAILURE,
      FETCH_GEO_SEARCH_RESULTS_FAILURE,
      FETCH_PANORAMA_ERROR,
      FETCH_DETAIL_FAILURE,
    ],
    setErrorsEffect,
  )

  yield takeLatest([FETCH_DATA_SELECTION_FAILURE], excludeUnauthorizedErrorEffect)
}
