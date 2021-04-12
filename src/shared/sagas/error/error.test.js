import { testSaga } from 'redux-saga-test-plan'
import { FETCH_GEO_SEARCH_RESULTS_FAILURE } from '../../ducks/data-search/constants'
import { FETCH_MARKERS_FAILURE } from '../../ducks/data-selection/constants'
import { FETCH_DETAIL_FAILURE } from '../../ducks/detail/constants'
import watchErrors, { setErrorsEffect } from './error'

describe('watchErrors', () => {
  it('should watch the error actions and call set errors', () => {
    const action = { type: FETCH_GEO_SEARCH_RESULTS_FAILURE }

    testSaga(watchErrors)
      .next()
      .takeLatestEffect(
        [FETCH_MARKERS_FAILURE, FETCH_GEO_SEARCH_RESULTS_FAILURE, FETCH_DETAIL_FAILURE],
        setErrorsEffect,
      )
      .next(action)
      .isDone()
  })
})
