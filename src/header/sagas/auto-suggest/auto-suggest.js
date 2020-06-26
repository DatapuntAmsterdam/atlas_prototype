import { call, put, takeLatest } from 'redux-saga/effects'

import autoSuggestSearch from '../../services/auto-suggest/auto-suggest'
import {
  FETCH_SUGGESTIONS_FAILURE,
  FETCH_SUGGESTIONS_REQUEST,
  FETCH_SUGGESTIONS_SUCCESS,
} from '../../ducks/auto-suggest/constants'

export function* fetchSuggestions(action) {
  try {
    const suggestions = yield call(autoSuggestSearch, action.payload)
    yield put({ type: FETCH_SUGGESTIONS_SUCCESS, suggestions })
  } catch (error) {
    yield put({ type: FETCH_SUGGESTIONS_FAILURE, error })
  }
}

export default function* watchFetchSuggestions() {
  yield takeLatest(FETCH_SUGGESTIONS_REQUEST, fetchSuggestions)
}
