import { put, takeLatest } from 'redux-saga/effects'
import { FETCH_PANORAMA_ERROR } from '../../../panorama/ducks/constants'
import { FETCH_GEO_SEARCH_RESULTS_FAILURE } from '../../ducks/data-search/constants'
import { FETCH_MARKERS_FAILURE } from '../../ducks/data-selection/constants'
import { FETCH_DETAIL_FAILURE } from '../../ducks/detail/constants'
import { ErrorType, setGlobalError } from '../../ducks/error/error-message'

export function* setErrorsEffect() {
  yield put(setGlobalError(ErrorType.General))
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
}
