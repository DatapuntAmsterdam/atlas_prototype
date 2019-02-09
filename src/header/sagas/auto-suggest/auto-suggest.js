import { call, put, select, takeLatest } from 'redux-saga/effects';

import autoSuggestSearch from '../../services/auto-suggest/auto-suggest';
import {
  FETCH_SUGGESTIONS_FAILURE,
  FETCH_SUGGESTIONS_REQUEST,
  FETCH_SUGGESTIONS_SUCCESS,
  SELECT_SUGGESTION
} from '../../ducks/auto-suggest/constants';
import { getMapOverlaysWithoutPanorama } from '../../../map/ducks/map/map-selectors';
import { setGlobalError } from '../../../shared/ducks/error/error-message';
import { toDataSuggestion } from '../../../store/redux-first-router/actions';

export function* fetchSuggestions(action) {
  try {
    const suggestions = yield call(autoSuggestSearch, action.query);
    yield put({ type: FETCH_SUGGESTIONS_SUCCESS, suggestions });
  } catch (error) {
    yield put({ type: FETCH_SUGGESTIONS_FAILURE, error });
  }
}

export function* doSelectSugestion(action) {
  try {
    const { suggestion, view } = action.payload;
    const overlaysWithoutPanorama = yield select(getMapOverlaysWithoutPanorama);
    yield put(toDataSuggestion(suggestion, view, overlaysWithoutPanorama));
  } catch (error) {
    yield put(setGlobalError(error.message));
  }
}

export default function* watchFetchSuggestions() {
  yield takeLatest(FETCH_SUGGESTIONS_REQUEST, fetchSuggestions);
  yield takeLatest(SELECT_SUGGESTION, doSelectSugestion);
}
