import { expectSaga, testSaga } from 'redux-saga-test-plan';
import watchFetchSuggestions, { fetchSuggestions } from './auto-suggest';
import {
  FETCH_SUGGESTIONS_REQUEST,
  FETCH_SUGGESTIONS_SUCCESS,
  FETCH_SUGGESTIONS_FAILURE
} from '../../ducks/auto-suggest/constants';
import autoSuggestSearch from '../../services/auto-suggest/auto-suggest';

describe('watchFetchSuggestions', () => {
  it(`should watch ${FETCH_SUGGESTIONS_REQUEST} and call fetchFilters`, () => {
    const action = { type: FETCH_SUGGESTIONS_SUCCESS };
    testSaga(watchFetchSuggestions)
      .next()
      .takeLatestEffect(FETCH_SUGGESTIONS_REQUEST, fetchSuggestions)
      .next(action)
      .isDone();
  });
});

describe('autoSuggestSearch', () => {
  it('should dispatch the correct action', () => (
    expectSaga(fetchSuggestions, { query: '' })
      .provide({
        call(effect, next) {
          return effect.fn === autoSuggestSearch ? 'payload' : next();
        }
      })
      .put({
        type: FETCH_SUGGESTIONS_SUCCESS,
        suggestions: 'payload'
      })
      .run()
  ));

  it('should throw error and put error', () => {
    const error = new Error('My Error');
    testSaga(fetchSuggestions, {})
      .next()
      .throw(error)
      .put({ type: FETCH_SUGGESTIONS_FAILURE, error })
      .next()
      .isDone();
  });
});
