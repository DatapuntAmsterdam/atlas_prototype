import { put, select, takeLatest } from 'redux-saga/es/internal/io';
import { redirect } from 'redux-first-router';
import { routing } from '../../../app/routes';

/**
 * This will set the url query. It will update by default (and keep the other arguments)
 * Unless when given payload: { replace: true }, this will replace the url query instead of updating
 * @param action
 * @returns {IterableIterator<*>}
 */
function* updateMapQuery(action) {
  const state = yield select();
  try {
    const query = {
      ...state.location.query,
      ...action.payload.query
    };

    // Remove keys with empty or false values
    const sanitizedQuery = Object.keys(query).reduce((acc, key) => {
      if (query[key]) {
        acc[key] = query[key];
      }
      return acc;
    }, {});

    yield put(redirect({
      type: routing.map.type, // Todo: get the type for the current page
      meta: {
        query: sanitizedQuery
      }
    }));
  } catch (error) {
    yield put({ type: 'MAP_UPDATE_ERROR', error });
  }
}

export default function* watchMapUpdate() {
  yield takeLatest('UPDATE_MAP', updateMapQuery);
}
